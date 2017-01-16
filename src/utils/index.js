export const normalize = (payload, idKey = 'id') => (
  payload.reduce((acc, item) => {
    acc[item[idKey]] = item;
    return acc;
  }, {})
)

export const values = (object) => (
  Object.keys(object).reduce((acc, key) => acc.concat(object[key]), [])
)
