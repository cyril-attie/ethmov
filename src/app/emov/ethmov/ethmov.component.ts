import { Component, OnInit } from '@angular/core';
import {Web3Service} from '../../util/web3.service';
import { MatSnackBar } from '@angular/material';

declare let require: any;
const ethmov_artifacts = require('../../../../build/contracts/EthMov.json');

@Component({
  selector: 'app-ethmov',
  templateUrl: './ethmov.component.html',
  styleUrls: ['./ethmov.component.css']
})

export class EthmovComponent implements OnInit {
  accounts: string[];
  EthMov: any;
  emptyAddress = '0x0000000000000000000000000000000000000000';

  model = {
    transportDemandPool: {},
    transportSupplyPool:{},
    transportCount : 0,
    account:'',
    pendingWithdrawal:0,
    newTransport:{
      _to:'',
      _sizeCategory:0,
      _weightCategory:0,
      _itinerary:[0,0,0,0,],
      _maxDeliveryTimestamp:0,
      _weiPacketValue:0,
      _bidPrice:0
    }
  };

  status = '';

  constructor(private web3Service: Web3Service, private matSnackBar: MatSnackBar) {
    console.log('Constructor: ' + web3Service);
  }

  ngOnInit(): void {
    console.log('OnInit: ' + this.web3Service);
    console.log(this);
    this.watchAccount();
    this.web3Service.artifactsToContract(ethmov_artifacts)
      .then((EthMovAbstraction) => {
        this.EthMov = EthMovAbstraction;
        this.EthMov.deployed().then(deployed => {
          console.log(deployed);
          deployed.TransportDemanded({}, (ev, err) => {
            console.log('Transport demanded, refreshing pool');
            this.refreshTransportDemandPool();
          });
          deployed.TransportSupplied({}, (ev,err) => {
            console.log('Transport supplied, refreshing available supplies pool');
            console.log(ev);
            // this.refreshTransportSupplyPool();
          });
          deployed.TransportationAllocated({}, (ev,err) => {
            console.log('Transport allocated, refreshing pool');
            this.refreshTransportDemandPool();
          });
          //pickup event
          deployed.PickUp({}, (ev,err) => {
            console.log('Packet picked up, refreshing pool');
            this.refreshTransportDemandPool();
          });
          deployed.Delivery({}, (ev,err) => {
            console.log('Packet delivered, refreshing pool');
            this.refreshTransportDemandPool();
          });
          deployed.AllocatedTransportSupplyCancelled({}, (ev,err) => {
            console.log('Allocated supply cancelled, refreshing supply and demand pools');
            this.refreshTransportDemandPool();
            // this.refreshTransportSupplyPool();
          });
          deployed.UnallocatedTransportSupplyCancelled({}, (ev,err) => {
            console.log('Allocated supply cancelled, refreshing supply and demand pools');
            // this.refreshTransportSupplyPool();
          });
        });
      });
  }

  watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.accounts = accounts;
      this.model.account = accounts[0];
      this.refreshPendingWithdrawal();
    });
  }

  setStatus(status) {
    this.matSnackBar.open(status, null, {duration: 3000});
  }

  async refreshPendingWithdrawal() {
    console.log('Refreshing pending withdrawals');

    try {
      const deployedEthMov : any = await this.EthMov.deployed();
      const pendingWithdrawalBalance = await deployedEthMov.pendingWithdrawals.call(this.model.account);
      this.model.pendingWithdrawal = pendingWithdrawalBalance ;
    } catch (e) {
      console.log(e);
      this.setStatus('Error getting balance; see log.');
    }
  }

  async refreshTransportDemandPool() {
    console.log('Refreshing Transport Demand Pool');

    try {
      const deployedEthMov : any = await this.EthMov.deployed();
      this.model.transportCount = await deployedEthMov.numTransports.call().toNumber();
      this.model.transportDemandPool;
      for (let i : number = 1; i < this.model.transportCount;i++) {
        let transporti : Object = await deployedEthMov.transportDemandPool.call(i);
        console.log('transport '+i.toString()+' is \n', transporti);
        /* if (transporti._to && transporti._to != this.emptyAddress) {
          this.model.transportDemandPool[i] = transporti;
        } */
      }
    } catch (e) {
      console.log(e);
      this.setStatus('Error getting balance; see log.');
    }
  }

  async refreshTransportSupplyPool(_transportId:number) {
    console.log('Refreshing Transport supply Pool');

    try {
      const deployedEthMov : any = await this.EthMov.deployed();
      const EthMovSupplyPoolNum: number = await deployedEthMov.getAvailableTransportSupplyLength.call(_transportId).toNumber();
      let supplyi : Object;
      for (let i : number = 1; i < EthMovSupplyPoolNum;i++) {
        supplyi = await deployedEthMov.AvailbleTransportSupply.call(_transportId,i);
        //add object to ethsupplypool only if non-empty
        this.model.transportSupplyPool[_transportId].push(supplyi);
      }
    } catch (e) {
      console.log(e);
      this.setStatus('Error getting balance; see log.');
    }
  }      
        
        
  setToAddress(e) {
    this.model.newTransport._to = e.target.value;
  }
  setSize(e) {
    this.model.newTransport._sizeCategory = e.target.value;
  }
  setWeight(e) {
    this.model.newTransport._weightCategory = e.target.value;
  }
  setItinerary1(e) {
    this.model.newTransport._itinerary[0] = e.target.value;
  }
  setItinerary2(e) {
    this.model.newTransport._itinerary[1] = e.target.value;
  }
  setItinerary3(e) {
    this.model.newTransport._itinerary[2] = e.target.value;
  }
  setItinerary4(e) {
    this.model.newTransport._itinerary[3] = e.target.value;
  }
  setDelivery(e) {
    this.model.newTransport._sizeCategory = e.target.value;
  }
  setPrice(e) {
    this.model.newTransport._bidPrice = e.target.value;
  }
  async postTransportDemand(){
    const deployedEthMov = await this.EthMov.deployed();
    await deployedEthMov.demandTransport.send(this.model.newTransport);
  }
}


