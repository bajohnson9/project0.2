import { BankingDAO, bankingDaoAzure } from "../daos/banking-dao"
import { Account, Client } from "../entities";


const bankingDao: BankingDAO = bankingDaoAzure;

let testId: string = null;

describe('DAO Specs', ()=>{

    it('should list all clients', async ()=>{
        let clients: Client[] = await bankingDao.getAllClients()
        expect(clients).toBeTruthy();
    })

    it('should create a client', async ()=>{
        let client: Client = {name:'carlton', id:'5', accounts:[]}
        client = await bankingDao.createClient(client)
        expect(client.id).not.toBe('')
    })

    it('should get a client', async ()=>{
        const client: Client = await bankingDao.getClientById(testId)
        expect(client.name).toBe('carlton')
    })

    
    /*
    it('should upsert a client', async ()=>{
        const account: Account = {aid:'2', balance:2000, type:"Checking"}
        let client: Client = {name:'james', id:testId, accounts:[account]}
        await bankingDao.modifyClient(client.id, client)
        client = await  bankingDao.getClientById(testId)
        expect(client.accounts.length).toBe(1)
        expect(client.name).toBe('james')
    })
    */

    it('should delete a client', async ()=>{
        const response = await bankingDao.deleteClientById(testId);
        expect(response).toBeTruthy();
    })

})