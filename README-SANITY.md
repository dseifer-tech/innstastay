# Sanity Hotel Management Setup for InnstaStay

This guide will help you set up Sanity CMS for managing hotel data in your InnstaStay application.

## Prerequisites

- Node.js installed
- Your Sanity API token (already provided)
- A Sanity project created

## Step 1: Create a Sanity Project

1. **Install Sanity CLI globally:**
   ```bash
   npm install -g @sanity/cli
   ```

2. **Create a new Sanity project:**
   ```bash
   sanity init --template clean --create-project "innstastay-hotel-management"
   ```

3. **Follow the prompts:**
   - Choose "Clean project with no predefined schemas"
   - Use the default dataset configuration
   - Note down your **Project ID** (you'll need this)

## Step 2: Configure Your Project

1. **Update the project ID in your files:**
   - Replace `'your-project-id'` in `lib/sanity.ts`
   - Replace `'your-project-id'` in `scripts/setup-sanity.js`

2. **Set up environment variables:**
   Create or update your `.env.local` file:
   ```env
   SANITY_API_TOKEN=your_sanity_api_token_here
   NEXT_PUBLIC_SANITY_PROJECT_ID=your-actual-project-id
   NEXT_PUBLIC_SANITY_DATASET=production
   ```
   
   **⚠️ Security Note**: Never commit API tokens to version control. Use environment variables and add `.env.local` to your `.gitignore` file.

## Step 3: Set Up Sanity Studio Schema

1. **Copy the hotel schema:**
   - Copy the contents of `sanity-schema/hotel.js` to your Sanity Studio's `schemas/hotel.js`

2. **Update your Sanity Studio's `schemas/index.js`:**
   ```javascript
   import hotel from './hotel'

   export const schemaTypes = [hotel]
   ```

3. **Start your Sanity Studio:**
   ```bash
   cd your-sanity-project
   sanity start
   ```

## Step 4: Migrate Existing Hotel Data

1. **Run the migration script:**
   ```bash
   node scripts/setup-sanity.js
   ```

2. **Verify the migration:**
   - Check your Sanity Studio to see if all hotels were created
   - You should see 8 hotels in the content list

## Step 5: Test the Integration

1. **Test the Sanity client:**
   ```bash
   npm run dev
   ```

2. **Check the API endpoints:**
   - Visit `/api/hotels` to see if hotels are being fetched from Sanity
   - Test individual hotel pages

## Step 6: Update Your Application Code

### Replace Hardcoded Data with Sanity Queries

1. **Update `lib/hotelData.ts`:**
   - Replace the hardcoded hotel arrays with Sanity queries
   - Use the functions from `lib/sanity.ts`

2. **Update `lib/hotels.ts`:**
   - Replace the `TORONTO_HOTELS` array with Sanity data
   - Update the `SLUG_TO_TOKEN` mapping

3. **Update API routes:**
   - Modify `/api/hotels/route.ts` to use Sanity
   - Update `/api/search/route.ts` to use Sanity

## Step 7: Set Up Webhooks (Optional)

1. **Create a webhook in Sanity:**
   - Go to your Sanity project settings
   - Add a webhook for content changes
   - Point it to your deployment URL (e.g., Vercel)

2. **Create a webhook handler:**
   ```javascript
   // app/api/webhooks/sanity/route.ts
   export async function POST(request: Request) {
     // Handle webhook and trigger rebuild
   }
   ```

## Step 8: Deploy and Test

1. **Deploy your changes:**
   ```bash
   git add .
   git commit -m "Add Sanity CMS integration"
   git push
   ```

2. **Test in production:**
   - Verify all hotel pages load correctly
   - Test the admin interface
   - Check that new hotels can be added

## Sanity Studio Features

### Hotel Management Interface

Once set up, you'll have access to:

- **Hotel List View:** See all hotels with search and filtering
- **Hotel Editor:** Rich editing interface for each hotel
- **Image Management:** Upload and manage hotel images
- **Booking Links:** Manage multiple booking URL templates
- **SEO Fields:** Custom titles and descriptions
- **Tags & Amenities:** Predefined lists for easy selection

### Adding New Hotels

1. **In Sanity Studio:**
   - Click "Create new" → "Hotel"
   - Fill in all required fields
   - Upload images
   - Set up booking links
   - Save and publish

2. **The hotel will automatically appear on your site**

### Editing Existing Hotels

1. **In Sanity Studio:**
   - Find the hotel in the content list
   - Click to edit
   - Make changes
   - Save and publish

2. **Changes will be reflected on your site immediately**

## Troubleshooting

### Common Issues

1. **"Project not found" error:**
   - Verify your project ID is correct
   - Check that your API token has the right permissions

2. **"Schema not found" error:**
   - Make sure the hotel schema is properly added to `schemas/index.js`
   - Restart your Sanity Studio

3. **Migration fails:**
   - Check that your API token has write permissions
   - Verify the project ID is correct
   - Make sure the hotel schema exists

4. **Images not loading:**
   - Check that images are properly uploaded in Sanity
   - Verify the image URL generation is working

### Getting Help

- [Sanity Documentation](https://www.sanity.io/docs)
- [Sanity Community](https://www.sanity.io/community)
- Check the Sanity Studio console for error messages

## Next Steps

Once this is set up, you can:

1. **Add more content types** (reviews, amenities, etc.)
2. **Set up custom input components** for better editing
3. **Add validation rules** for data integrity
4. **Set up automated workflows** for content approval
5. **Integrate with other services** (Google Hotels API, etc.)

## Security Notes

- Keep your API tokens secure
- Use environment variables for sensitive data
- Set up proper CORS settings in Sanity
- Consider using read-only tokens for public queries
