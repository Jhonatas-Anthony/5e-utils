export interface MenuItem {
  label: string
  route?: string
  children?: MenuItem[]
}

export const menuItems: MenuItem[] = [
  {
    label: 'common.home',
    route: '/',
  },
  {
    label:'common.creation',
    children: [
      { label: 'navbar.creation.spell', route: '/create/spells' },
      { label: 'navbar.creation.item', route: '/create/items' },
    ]
  },
]
