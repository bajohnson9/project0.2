import Express from "express";
import { bankingDaoAzure } from "./daos/banking-dao";
import { Account, Client } from "./entities";
import errorHandler from "./error-handles";
import { BankingService, BankingServiceImpl } from "./services/banking-service";

const app = Express()
app.use(Express.json())


const bankingService: BankingService = new BankingServiceImpl(bankingDaoAzure)

//get all clients
app.get('/clients', async (req, res) => {

    try {
        const clients: Client[] = await bankingService.getAllClients();
        res.status(200)
        res.send(clients)
    } catch (error) {
        errorHandler(error,req,res)
    }
    
})

//get single client
app.get('/clients/:id', async (req, res)=>{ 
    try {
        const client: Client = await bankingService.getClientById(req.params.id)    
        res.status(200)
        res.send(client)
    } catch (error) {
        errorHandler(error,req,res)
    }
    

})

//add client
app.post('/clients', async (req, res)=>{
    try {
        let client: Client = req.body
        //console.log(client)
        client = await bankingService.addClient(client)
        res.status(201)
        res.send(client)      
    } catch (error) {
        errorHandler(error,req,res)
    }

})

//update CLIENT
app.put('/clients/:id', async (req,res)=>{

    try {
        let client: Client = req.body
        const updatedClient = await bankingService.modifyClient(req.params.id, client)
        res.status(201)
        res.send(updatedClient)   
    } catch (error) {
        errorHandler(error,req,res)
    }
})

//delete client
app.delete('/clients/:id', async (req,res) =>{
    try {
        const client = await bankingService.deleteClient(req.params.id)    
        res.status(205)
        res.send("deleted = " + client)
    } catch (error) {
        errorHandler(error,req,res)
    }
})

// ----------------------------------------BLOCK 2------------------------------------- //    

//add account
app.put('/clients/:id/accounts', async (req,res)=>{

    try {
        let account: Account = req.body
        let client: Client = await bankingService.getClientById(req.params.id)
        const updatedClient = await bankingService.addAccount(client, account)
        res.status(201)
        res.send(updatedClient)   
    } catch (error) {
        errorHandler(error,req,res)
    }
})

//get accounts
app.get('/clients/:id/accounts', async (req,res)=>{
    try {
        const client: Client = await bankingService.getClientById(req.params.id)    
        res.status(200)
        res.send(client.accounts)
    } catch (error) {
        errorHandler(error,req,res)
    }

})

//withdraw


app.patch('/clients/:id/accounts/:type/withdraw', async (req, res) =>{
    
    //SEVENTH TRY

    //FIRST-SIXTH TRIES
    /*
    try{
        const {id, type} = req.params;
        const client: Client = await bankingService.getClientById(id)
        console.log(id + "<--id---type-->" + type)
        const patch = req.body;
        const amount = 500;
        console.log(patch + " " + type + " " + id);
        // error vvv
        
        for(let i = 0; i < client.accounts.length; i++){

        }

        const index = client.accounts.findIndex(x => x.type === type);
        console.log(index + ': ' + client.accounts[index])
        client.accounts[index].balance = client.accounts[index].balance - amount;
        bankingService.modifyClient(client.id, client);
        res.send("associate patch successfully");
    } catch (error) {
        errorHandler(error,req,res)
    }
    */

})

app.listen(3000, () => console.log('App started'))