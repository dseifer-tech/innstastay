#!/usr/bin/env node

// ⚠️ DEPRECATED: POI (Points of Interest) system has been removed from the CMS
// Hotel POI data is now handled differently or removed entirely
//
// Legacy usage: node -r dotenv/config scripts/import-pois-hardcoded.js dotenv_config_path=.env.local

const { createClient } = require('@sanity/client')

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const TOKEN = process.env.SANITY_API_TOKEN

if (!PROJECT_ID || !TOKEN) {
  console.error('Missing envs: NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN')
  process.exit(1)
}

const client = createClient({ projectId: PROJECT_ID, dataset: DATASET, token: TOKEN, apiVersion: '2023-05-03', useCdn: false })

function slugify(name) { return name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'') }

const POIS = [
  { name: "CN Tower", url: "https://www.google.com/search?q=CN+Tower", imageUrl: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcToC6Dg8U9nucWiitonjOGkMhhIqrf6NalAdrVeYXaiQkDqBuDy", rating: 4.6, reviews: 81033, shortDescription: "Over 553-metre landmark tower with panoramic city views and a glass floor experience." },
  { name: "Royal Ontario Museum", url: "https://www.google.com/search?q=Royal+Ontario+Museum", imageUrl: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTm301sIsH1CmyGx9hhuENMH3Ni1yzLZJvjE6iGGfo88sCYNTWw", rating: 4.7, reviews: 39728, shortDescription: "Natural history and world cultures exhibits — including fossils, artifacts, and more." },
  { name: "Ripley's Aquarium of Canada", url: "https://www.google.com/search?q=Ripley's+Aquarium+of+Canada", imageUrl: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQoCFpB93wBlMQcUqbnrBUM1I-BIS30KwpXkEZFawxcbOjHCqj_", rating: 4.6, reviews: 64115, shortDescription: "Modern aquarium featuring diverse aquatic species, tunnel exhibits, and family-friendly events." },
  { name: "Art Gallery of Ontario", url: "https://www.google.com/search?q=Art+Gallery+of+Ontario", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH4mdIZfQ-6BC-k4mO9xxXPB-eYZd37_oe73iDacYf_JkhBscP", rating: 4.7, reviews: 17844, shortDescription: "One of North America's largest art museums with a major Canadian and European collection." },
  { name: "Casa Loma", url: "https://www.google.com/search?q=Casa+Loma", imageUrl: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcT_DhhHAloXWTAcX84ZiwdwYHjlM13s9Jsl5SlBh3qc-jzyUUM6", rating: 4.5, reviews: 31533, shortDescription: "Grand 1914 castle featuring regular tours & gardens that are open seasonally." },
  { name: "St. Lawrence Market", url: "https://www.google.com/search?q=St.+Lawrence+Market", imageUrl: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSNzfS0Yisnz-lksUXqnJyMsg_Oqz0b1LqBRxC_0LQ1hfXII1C6", rating: 4.6, reviews: 39009, shortDescription: "Spacious market with 100+ vendors, bakers, butchers & artisans, with produce & antiques on weekends." },
  { name: "Toronto Islands", url: "https://www.google.com/search?q=Toronto+Islands", imageUrl: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcT5in4EAwdgmFl5BBC-t_R2_Emd0JAJ-ynG1DciT5_xRScBGvmU", rating: 4.7, reviews: 1828, shortDescription: "Islands across from downtown offering recreational activities, beaches & family-friendly attractions." },
  { name: "Hockey Hall of Fame", url: "https://www.google.com/search?q=Hockey+Hall+of+Fame", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQM1-Y71XhtzuTXoaA9QPngRo_Ds6c8ohJef9f6C3PdeyY10b_1", rating: 4.7, reviews: 6735, shortDescription: "Massive hockey museum with gear, games, and the Stanley Cup on display." },
  { name: "CF Toronto Eaton Centre", url: "https://www.google.com/search?q=CF+Toronto+Eaton+Centre", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDE1qITYSV9U8ypboYS1QEp0nkwrgVHCLr3nZ38X39o6HgPsLI", rating: 4.5, reviews: 54664, shortDescription: "Sprawling shopping mall with a historic glass roof and 250+ stores and boutiques." },
  { name: "High Park", url: "https://www.google.com/search?q=High+Park", imageUrl: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQp4kuV2jzlxXpYaKLz52C-WXb3Rn-1HjGssXnCrd8xKK3YiyYq", rating: 4.7, reviews: 27472, shortDescription: "Expansive park featuring trails, gardens, sports areas, a zoo, and more." },
  { name: "Nathan Phillips Square", url: "https://www.google.com/search?q=Nathan+Phillips+Square", imageUrl: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRthVVW_oiEDVRgiMPp6fNOFu2EosC7h_nQCkNi-0R5MaFy7_HK", rating: 4.6, reviews: 39192, shortDescription: "Lively civic square with skating rink, concerts, and seasonal events in front of city hall." },
  { name: "Rogers Centre", url: "https://www.google.com/search?q=rogers+centre", imageUrl: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTbvlNUduS39Z2g6TkzqhL235pD6Zc1bGYAvkRsi7Bs7q9Sdcix", rating: 4.1, reviews: 10, shortDescription: "Iconic sports stadium and concert venue, home to the Toronto Blue Jays." },
  { name: "Evergreen Brick Works", url: "https://www.google.com/search?q=Evergreen+Brick+Works", imageUrl: "https://lh3.googleusercontent.com/gps-cs-s/AC9h4nor1qie4iFue-79QngzpnpqFQ0LSCHZODMKmJY0Om-hxTc7uksmJ6yK5DUhf2QYYPTywunRd3vD5XR4bqRPoC8ugDGbL1TNOqoiGw5JLAMfAHOsgojrT95P6yLz-JrAUr_mi0RLJA=w180-h120-k-no", rating: 4.6, reviews: 9764, shortDescription: "Eco-friendly attraction with markets, trails, and cultural events in a former industrial space." },
  { name: "EdgeWalk at the CN Tower", url: "https://www.google.com/search?q=EdgeWalk+at+the+CN+Tower", imageUrl: "https://lh3.googleusercontent.com/gps-cs-s/AC9h4np4G1N9h-UwdvK6T8kdGAi-ztiyCA2kjues-JBUhppqLTBKM6AyvThbsXudM6Xq2evgPd9cobNjdINhRSg-H-p_bcN-6kfZguvHntKq8FH7ZSqBN23FgQhju2Qqi3QtSD1vMIcp=w160-h120-k-no", rating: 4.8, reviews: 744, shortDescription: "Outdoor skywalk experience at the top of the CN Tower for thrill-seekers." },
  { name: "Sankofa Square", url: "https://www.google.com/search?q=Sankofa+Square", imageUrl: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQMmZ6Ii1YyVijipK7Gfnv4SWhlDtTYwKFgeiSng78ZclY6ggz9", rating: 4.5, reviews: 20990, shortDescription: "Downtown public space hosting community events, concerts, and cultural activations." },
]

async function upsertPoi(p) {
  const _id = `poi.${slugify(p.name)}`
  return client.createOrReplace({
    _id,
    _type: 'poi',
    name: p.name,
    slug: { _type: 'slug', current: slugify(p.name) },
    url: p.url,
    imageUrl: p.imageUrl,
    rating: p.rating,
    reviews: p.reviews,
    shortDescription: p.shortDescription,
  })
}

async function replacePoiGridOnDowntown(poiIds) {
  const page = await client.fetch('*[_type=="page" && slug.current=="hotels/toronto-downtown"][0]{_id, sections}')
  if (!page?._id) return
  const refs = poiIds.map((_id) => ({ _type: 'reference', _ref: _id }))
  const sections = Array.isArray(page.sections) ? [...page.sections] : []
  const filtered = sections.filter((s) => s?._type !== 'poiGrid')
  filtered.push({ _type: 'poiGrid', title: 'Nearby Attractions', pois: refs })
  await client.patch(page._id).set({ sections: filtered }).commit()
}

async function run() {
  console.log('Importing hardcoded POIs...')
  const createdIds = []
  for (const p of POIS) {
    const res = await upsertPoi(p)
    createdIds.push(res._id)
  }
  await replacePoiGridOnDowntown(createdIds)
  console.log('Imported', createdIds.length, 'POIs and updated downtown poiGrid')
}

run().catch((e)=>{ console.error('Import failed:', e?.message || e); process.exit(1) })


