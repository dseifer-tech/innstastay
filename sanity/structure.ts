import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem().title('Pages').child(S.documentTypeList('page').title('Pages')),
      // Hotels section
      S.listItem()
        .title('Hotels')
        .child(
          S.list()
            .title('Hotels')
            .items([
              S.listItem()
                .title('All Hotels')
                .child(
                  S.documentList()
                    .title('All Hotels')
                    .filter('_type == "hotel"')
                    .defaultOrdering([{field: 'name', direction: 'asc'}])
                ),
              S.listItem()
                .title('Active Hotels')
                .child(
                  S.documentList()
                    .title('Active Hotels')
                    .filter('_type == "hotel" && isActive == true')
                    .defaultOrdering([{field: 'name', direction: 'asc'}])
                ),
              S.listItem()
                .title('Inactive Hotels')
                .child(
                  S.documentList()
                    .title('Inactive Hotels')
                    .filter('_type == "hotel" && isActive != true')
                    .defaultOrdering([{field: 'name', direction: 'asc'}])
                ),
            ])
        ),
      S.listItem().title('POIs').child(S.documentTypeList('poi').title('POIs')),
      S.divider(),
      S.listItem().title('Fragments').child(S.documentTypeList('fragment').title('Fragments')),
      S.divider(),
      S.listItem().title('Navigation').child(S.editor().schemaType('navigation').documentId('navigation')),
      S.listItem().title('Site Settings').child(S.editor().schemaType('siteSettings').documentId('siteSettings')),
      S.listItem().title('Redirects').child(S.documentTypeList('redirect').title('Redirects')),
      // Other document types
      ...S.documentTypeListItems().filter(
        (listItem) => !['hotel','page','poi','fragment','navigation','siteSettings','redirect'].includes(listItem.getId() as string)
      ),
    ])
