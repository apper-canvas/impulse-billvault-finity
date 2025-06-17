import categoryData from '../mockData/categories.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class CategoryService {
  constructor() {
    this.data = [...categoryData]
  }

  async getAll() {
    await delay(300)
    return [...this.data]
  }

  async getById(id) {
    await delay(250)
    const item = this.data.find(category => category.Id === parseInt(id, 10))
    return item ? { ...item } : null
  }

  async create(category) {
    await delay(400)
    const maxId = this.data.reduce((max, item) => Math.max(max, item.Id), 0)
    const newCategory = {
      ...category,
      Id: maxId + 1,
      createdAt: new Date().toISOString()
    }
    this.data.push(newCategory)
    return { ...newCategory }
  }

  async update(id, updates) {
    await delay(350)
    const index = this.data.findIndex(category => category.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Category not found')
    }
    
    const { Id, ...allowedUpdates } = updates
    this.data[index] = {
      ...this.data[index],
      ...allowedUpdates,
      updatedAt: new Date().toISOString()
    }
    return { ...this.data[index] }
  }

  async delete(id) {
    await delay(300)
    const index = this.data.findIndex(category => category.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Category not found')
    }
    
    const deleted = this.data.splice(index, 1)[0]
    return { ...deleted }
  }
}

export default new CategoryService()