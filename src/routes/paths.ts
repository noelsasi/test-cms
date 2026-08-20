const ROOT_TESTS = '/tests'

export const PATH_AUTH = {
  login: '/login',
}

export const PATH_DASHBOARD = {
  root: '/dashboard',
  tests: {
    create: `${ROOT_TESTS}/new`,
    edit: (id: string) => `${ROOT_TESTS}/${id}/edit`,
    questions: (id: string) => `${ROOT_TESTS}/${id}/questions`,
    preview: (id: string) => `${ROOT_TESTS}/${id}/preview`,
  },
}

export const PATH_AFTER_LOGIN = PATH_DASHBOARD.root
