import { forEachChild } from "typescript";
import { BankingDAO } from "../daos/banking-dao";
import { Client, Account } from "../entities";
import { v4 } from "uuid"

export interface BankingService{
    //BLOCK 1
    getClientById(clientId:string):Promise<Client>
    getAllClients():Promise<Client[]>;
    addClient(client:Client): Promise<Client>
    modifyClient(clientID:string, client: Client):Promise<Client>
    deleteClient(clientId:string):Promise<Boolean>
    //BLOCK 2
    addAccount(client:Client, account:Account):Promise<Client>
    getAccounts(acctID:string):Promise<Client>
    //withdraw(client:Client, type: string)
}


export class BankingServiceImpl implements BankingService{
    constructor(private bankingDAO: BankingDAO){}

    async addClient(client: Client): Promise<Client> {
        client.accounts = client.accounts || []
        client = await this.bankingDAO.createClient(client)
        return client;
    }

    async getAllClients(): Promise<Client[]> {
        return this.bankingDAO.getAllClients() 
    }

    async getClientById(clientId: string): Promise<Client> {
        return this.bankingDAO.getClientById(clientId)
    }
    
    async modifyClient(clientID: string, client: Client): Promise<Client> {
        client.accounts = client.accounts || []
        client = await this.bankingDAO.modifyClient(clientID, client)
        return client;
    }

    async deleteClient(clientId: string): Promise<Boolean> {
        return this.bankingDAO.deleteClientById(clientId);
    }

    // --------------------------------BLOCK 2----------------------------------- //
    async addAccount(client: Client, account: Account): Promise<Client> {

        //create a temporary new client from client; push the new account
        console.log('addAccount service started')

        const tempClient = await this.bankingDAO.getClientById(client.id)
        console.log(account);
        console.log(client);
        tempClient.accounts.push(account);
        client = tempClient

        console.log('service finished\nClient: ' + client)
        return this.bankingDAO.addAccount(client)
    }

    async getAccounts(cid: string): Promise<Client> {
        return this.bankingDAO.getAccounts(cid);
    }
    
}