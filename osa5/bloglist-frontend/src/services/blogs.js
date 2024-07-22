import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const like = async (blog) => {
  const url = baseUrl + '/' + blog.id
  await axios.put(url, blog)
}

const remove = async (blog) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.delete(baseUrl + '/' + blog.id, config)
  return response.data
}

export default { getAll, setToken, create, like, remove }
