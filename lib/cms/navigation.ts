import { getClient } from '@/lib/cms/sanityClient'

export async function getNavigation() {
  const query = `*[_type == "navigation"][0]{ mainMenu, footerMenu }`
  return getClient().fetch(query)
}


