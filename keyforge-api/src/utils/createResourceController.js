const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function createResourceController(model, notFoundMessage) {
  return {
    async getAll(_req, res) {
      try {
        const data = await model.getAll()
        res.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600')
        res.json(data)
      } catch (err) {
        res.status(500).json({ error: err.message })
      }
    },

    async getById(req, res) {
      const { id } = req.params
      if (!UUID_RE.test(id)) {
        return res.status(404).json({ error: notFoundMessage })
      }

      try {
        const data = await model.getById(id)
        if (!data) return res.status(404).json({ error: notFoundMessage })
        res.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600')
        res.json(data)
      } catch (err) {
        res.status(500).json({ error: err.message })
      }
    },

    async create(req, res) {
      try {
        const data = await model.create(req.body)
        res.status(201).json(data)
      } catch (err) {
        res.status(400).json({ error: err.message })
      }
    },

    async update(req, res) {
      const { id } = req.params
      if (!UUID_RE.test(id)) {
        return res.status(404).json({ error: notFoundMessage })
      }

      try {
        const data = await model.update(id, req.body)
        if (!data) return res.status(404).json({ error: notFoundMessage })
        res.json(data)
      } catch (err) {
        res.status(400).json({ error: err.message })
      }
    },

    async remove(req, res) {
      const { id } = req.params
      if (!UUID_RE.test(id)) {
        return res.status(404).json({ error: notFoundMessage })
      }

      try {
        const data = await model.remove(id)
        if (!data) return res.status(404).json({ error: notFoundMessage })
        res.json({ deleted: true, id: data.id })
      } catch (err) {
        res.status(500).json({ error: err.message })
      }
    },
  }
}
