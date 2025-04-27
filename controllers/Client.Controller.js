import Client from '../models/client.model.js'

// Get all clients
 const getAllClients = async (req, res) => {
    try {
      const clients = await Client.findAll();
      res.status(200).json(clients);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching clients', error });
    }
  };
  
  // Get a single client
   const getClientById = async (req, res) => {
    try {
      const client = await Client.findByPk(req.params.id);
      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }
      res.status(200).json(client);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching client', error });
    }
  };
  
  // Create a new client
   const createClient = async (req, res) => {
    try {
      const client = await Client.create(req.body);
      res.status(201).json(client);
    } catch (error) {
      res.status(400).json({ message: 'Error creating client', error });
    }
  };
  
  // Update a client
   const updateClient = async (req, res) => {
    try {
      const client = await Client.findByPk(req.params.id);
      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }
      await client.update(req.body);
      res.status(200).json(client);
    } catch (error) {
      res.status(400).json({ message: 'Error updating client', error });
    }
  };
  
  // Delete a client
   const deleteClient = async (req, res) => {
    try {
      const client = await Client.findByPk(req.params.id);
      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }
      await client.destroy();
      res.status(200).json({ message: 'Client deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting client', error });
    }
  };

  export{getAllClients,getClientById,createClient,updateClient,deleteClient};