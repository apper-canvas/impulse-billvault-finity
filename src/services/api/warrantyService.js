import warrantyData from '../mockData/warranties.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class WarrantyService {
  constructor() {
    this.data = [...warrantyData]
  }

  async getAll() {
    await delay(300)
    return [...this.data]
  }

  async getById(id) {
    await delay(250)
    const item = this.data.find(warranty => warranty.Id === parseInt(id, 10))
    return item ? { ...item } : null
  }

  async create(warranty) {
    await delay(400)
    const maxId = this.data.reduce((max, item) => Math.max(max, item.Id), 0)
    const newWarranty = {
      ...warranty,
      Id: maxId + 1,
      createdAt: new Date().toISOString()
    }
    this.data.push(newWarranty)
    return { ...newWarranty }
  }

  async update(id, updates) {
    await delay(350)
    const index = this.data.findIndex(warranty => warranty.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Warranty not found')
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
    const index = this.data.findIndex(warranty => warranty.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Warranty not found')
    }
    
    const deleted = this.data.splice(index, 1)[0]
    return { ...deleted }
  }

  async getExpiring(days = 30) {
    await delay(250)
    const today = new Date()
    const futureDate = new Date(today.getTime() + (days * 24 * 60 * 60 * 1000))
    
    return this.data
      .filter(warranty => {
        const expirationDate = new Date(warranty.expirationDate)
        return expirationDate >= today && expirationDate <= futureDate
      })
      .sort((a, b) => new Date(a.expirationDate) - new Date(b.expirationDate))
      .map(warranty => ({ ...warranty }))
  }

  getDaysUntilExpiration(expirationDate) {
    const today = new Date()
    const expiry = new Date(expirationDate)
    const diffTime = expiry - today
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }
}

export default new WarrantyService()