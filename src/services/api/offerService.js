import offerData from '../mockData/offers.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class OfferService {
  constructor() {
    this.data = [...offerData]
  }

  async getAll() {
    await delay(300)
    return [...this.data]
  }

  async getById(id) {
    await delay(250)
    const item = this.data.find(offer => offer.Id === parseInt(id, 10))
    return item ? { ...item } : null
  }

  async create(offer) {
    await delay(400)
    const maxId = this.data.reduce((max, item) => Math.max(max, item.Id), 0)
    const newOffer = {
      ...offer,
      Id: maxId + 1,
      createdAt: new Date().toISOString()
    }
    this.data.push(newOffer)
    return { ...newOffer }
  }

  async update(id, updates) {
    await delay(350)
    const index = this.data.findIndex(offer => offer.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Offer not found')
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
    const index = this.data.findIndex(offer => offer.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Offer not found')
    }
    
    const deleted = this.data.splice(index, 1)[0]
    return { ...deleted }
  }

  async getActive() {
    await delay(250)
    const today = new Date()
    
    return this.data
      .filter(offer => {
        const expirationDate = new Date(offer.expirationDate)
        return expirationDate >= today
      })
      .sort((a, b) => new Date(a.expirationDate) - new Date(b.expirationDate))
      .map(offer => ({ ...offer }))
  }

  getDaysUntilExpiration(expirationDate) {
    const today = new Date()
    const expiry = new Date(expirationDate)
    const diffTime = expiry - today
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }
}

export default new OfferService()