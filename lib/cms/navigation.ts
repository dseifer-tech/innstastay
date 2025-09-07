import { client } from '@/sanity/lib/client'

export async function getNavigation() {
  const query = `*[_type == "navigation"][0]{ mainMenu, footerMenu }`
  return client.fetch(query)
}


