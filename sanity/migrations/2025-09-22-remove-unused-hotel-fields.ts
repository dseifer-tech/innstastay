/**
 * Migration: Remove unused hotel fields (brand, bookingTemplate, nested seo)
 * 
 * This migration:
 * 1. Promotes nested seo.title/description to top-level if missing
 * 2. Removes unused fields: brand, bookingTemplate, seo group
 * 
 * Safe to run multiple times (idempotent)
 */

import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN!,
  apiVersion: '2025-09-22',
  useCdn: false,
});

interface HotelDoc {
  _id: string;
  seo?: {
    title?: string;
    description?: string;
    canonical?: string;
    ogImage?: any;
  };
  seoTitle?: string;
  seoDescription?: string;
  brand?: string;
  bookingTemplate?: string;
}

async function run() {
  console.log('🔄 Starting hotel schema cleanup migration...\n');

  // Fetch all hotels that have any of the fields we're cleaning up
  const query = `*[_type == "hotel" && (defined(brand) || defined(bookingTemplate) || defined(seo))]{
    _id,
    seo,
    seoTitle,
    seoDescription,
    brand,
    bookingTemplate
  }`;

  console.log('📊 Querying hotels with unused fields...');
  const docs: HotelDoc[] = await client.fetch(query);
  console.log(`Found ${docs.length} hotels to process\n`);

  if (docs.length === 0) {
    console.log('✅ No hotels found with unused fields. Migration complete!');
    return;
  }

  let promotedTitleCount = 0;
  let promotedDescriptionCount = 0;
  let unsetCount = 0;

  for (const doc of docs) {
    console.log(`Processing hotel: ${doc._id}`);
    
    let patch = client.patch(doc._id);
    let hasChanges = false;

    // Promote nested seo.title to seoTitle if missing
    if (doc.seo?.title && !doc.seoTitle) {
      console.log(`  📤 Promoting seo.title to seoTitle: "${doc.seo.title}"`);
      patch = patch.set({ seoTitle: doc.seo.title });
      promotedTitleCount++;
      hasChanges = true;
    }

    // Promote nested seo.description to seoDescription if missing  
    if (doc.seo?.description && !doc.seoDescription) {
      console.log(`  📤 Promoting seo.description to seoDescription: "${doc.seo.description.substring(0, 50)}..."`);
      patch = patch.set({ seoDescription: doc.seo.description });
      promotedDescriptionCount++;
      hasChanges = true;
    }

    // Remove unused fields
    const fieldsToUnset = [];
    if (doc.brand !== undefined) {
      fieldsToUnset.push('brand');
      console.log(`  🗑️  Removing brand field`);
    }
    if (doc.bookingTemplate !== undefined) {
      fieldsToUnset.push('bookingTemplate');
      console.log(`  🗑️  Removing bookingTemplate field`);
    }
    if (doc.seo !== undefined) {
      fieldsToUnset.push('seo');
      console.log(`  🗑️  Removing nested seo group`);
    }

    if (fieldsToUnset.length > 0) {
      patch = patch.unset(fieldsToUnset);
      hasChanges = true;
    }

    if (hasChanges) {
      await patch.commit({ autoGenerateArrayKeys: true });
      unsetCount++;
      console.log(`  ✅ Updated hotel ${doc._id}\n`);
    } else {
      console.log(`  ℹ️  No changes needed for hotel ${doc._id}\n`);
    }
  }

  // Final summary
  const summary = {
    totalFound: docs.length,
    promotedTitleCount,
    promotedDescriptionCount, 
    unsetCount,
    timestamp: new Date().toISOString()
  };

  console.log('🎉 Migration completed successfully!\n');
  console.log('📈 Summary:');
  console.log(JSON.stringify(summary, null, 2));
}

// Error handling and execution
run().catch(err => {
  console.error('❌ Migration failed:');
  console.error(err);
  process.exit(1);
});
