import { Account, Client } from "../entities";
import { CosmosClient } from "@azure/cosmos";
import { v4 } from "uuid";
import { ResourceNotFoundError } from "../error-handles";
import { StringMap } from "ts-jest";

export interface BankingDAO{

    //Create
    createClient(client: Client): Promise<Client>
    addAccount(client: Client): Promise<Client>
    //Read
    getClientById(id: string): Promise<Client>
    getAllClients(): Promise<Client[]>
    getAccounts(id: string): Promise<Client>
    //Update
    modifyClient(clientID: string, client: Client): Promise<Client>
    //withdraw(clientID: string, acctID: string, client: Client)
    //Delete
    deleteClientById(id: string ): Promise<boolean>

}


class BankingDaoAzure implements BankingDAO{
    //private cclient = new CosmosClient(process.env.DB ?? 'AccountEndpoint=https://rpas-cosmosdb-account-bj.documents.azure.com:443/;AccountKey=n1tabnIm5g3iBMx1CAN2zqRN4bHVlRI8jFXaIszIOVgrB8Wqo35AtLB3Gj1ruIEhS9BYQcmLSclRKyOmpVMuJg==')
    private cclient = new CosmosClient(process.env.DB ?? 'AccountEndpoint=https://rpas-cosmosdb-account-bj.documents.azure.com:443/;AccountKey=n1tabnIm5g3iBMx1CAN2zqRN4bHVlRI8jFXaIszIOVgrB8Wqo35AtLB3Gj1ruIEhS9BYQcmLSclRKyOmpVMuJg==')
    private database = this.cclient.database('project0-db')
    private container = this.database.container('clients')
    //as accounts are created, the ID increases ; CALL RIGHT BEFORE RETURN? no
    /*
    orderAccounts(client: Client){
        
        let i = 0;
        while (i < client.accounts.length){
            client.accounts[i].id=/*i.toString() ?? v4();
            i = i.valueOf() + 1;
        }
        return client;
    }*/
    

    async createClient(client: Client): Promise<Client> {
        //client = this.orderAccounts(client);
        const response = await this.container.items.create<Client>(client)
        const {id, name, accounts} = response.resource;
        return {id, name, accounts}
    }

    async getClientById(cid: string): Promise<Client> {
        const response = await this.container.item(cid, cid).read<Client>();
        console.log('get by id started')
        if(!response.resource){
            console.log('error in get by id')
            throw new ResourceNotFoundError(`Client with id ${cid} was not found`)
        }
        console.log('about to return in get by id')
        return {id:response.resource.id, name: response.resource.name, accounts:response.resource.accounts}
    }

    async getAllClients(): Promise<Client[]> {
        const response = await this.container.items.readAll<Client>().fetchAll()
        return response.resources.map(i => ({accounts: i.accounts, id:i.id, name:i.name}))
    }
    
    //heavily modified, consider starting over
    async modifyClient(cid:string, client: Client): Promise<Client> {
        console.log('modifyClient')
        client.id = cid;
        console.log('cid: ' + cid)
        //client = this.orderAccounts(client);
        const response = await this.container.items.upsert<Client>(client);
        console.log(response.resource.accounts)
        console.log('about to return something from DAO')
        return response.resource;
    }
    

    async deleteClientById(id: string): Promise<boolean> {
       const response = await this.container.item(id,id).delete<Boolean>()
       return true
    }

    // ------ BLOCK 2 ------ //
    
    async addAccount(client: Client): Promise<Client>{
        //put the new client (with an extra acct) on top of the old one
        //client = this.orderAccounts(client);
        console.log('awaited for addAccount DAO')
        console.log(client)
        const response = await this.container.items.upsert<Client>(client);
        console.log('about to return something from DAO')
    
        return response.resource;
    }

    async getAccounts(cid: string): Promise<Client> {
        const response = await this.container.item(cid, cid).read<Client>();
        return response.resource;
        
    }

    //async withdraw(clientID: string, acctID: string, client: Client) {}
}

export const bankingDaoAzure = new BankingDaoAzure();