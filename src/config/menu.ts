export interface MenuItem {
  label: string
  route?: string
  children?: MenuItem[]
}

export const menuItems: MenuItem[] = [
  {
    label: 'Início',
    route: '/',
  },
  {
    label: 'Usuários',
    children: [
      { label: 'Listar Usuários', route: '/users' },
      { label: 'Novo Usuário', route: '/users/new' },
    ],
  },
  {
    label: 'Configurações',
    children: [
      { label: 'Perfil', route: '/settings/profile' },
      { label: 'Preferências', route: '/settings/preferences' },
    ],
  },
]
