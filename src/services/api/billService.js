import billData from '../mockData/bills.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class BillService {
  constructor() {
    this.data = [...billData]
  }

  async getAll() {
    await delay(300)
    return [...this.data]
  }

  async getById(id) {
    await delay(250)
    const item = this.data.find(bill => bill.Id === parseInt(id, 10))
    return item ? { ...item } : null
  }

  async create(bill) {
    await delay(400)
    const maxId = this.data.reduce((max, item) => Math.max(max, item.Id), 0)
    const newBill = {
      ...bill,
      Id: maxId + 1,
      createdAt: new Date().toISOString()
    }
    this.data.push(newBill)
    return { ...newBill }
  }

  async update(id, updates) {
    await delay(350)
    const index = this.data.findIndex(bill => bill.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Bill not found')
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
    const index = this.data.findIndex(bill => bill.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Bill not found')
    }
    
    const deleted = this.data.splice(index, 1)[0]
    return { ...deleted }
  }

  async getUpcoming(days = 30) {
    await delay(250)
    const today = new Date()
    const futureDate = new Date(today.getTime() + (days * 24 * 60 * 60 * 1000))
    
    return this.data
      .filter(bill => {
        const dueDate = new Date(bill.dueDate)
        return dueDate >= today && dueDate <= futureDate && !bill.isPaid
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .map(bill => ({ ...bill }))
  }

  async markPaid(id) {
    await delay(300)
    return this.update(id, { isPaid: true })
  }
}

export default new BillService()