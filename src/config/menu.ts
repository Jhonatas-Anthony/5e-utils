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
    label:'common.spells',
    children: [
      { label: 'navbar.spells.create', route: '/spells/create' },
    ]
  },
]
