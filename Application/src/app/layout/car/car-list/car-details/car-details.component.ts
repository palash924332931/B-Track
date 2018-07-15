import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../../router.animations';
import { AlertService } from '../../../../shared/modules/alert/alert.service'
import { CarService, CommonService,CustomNgbDateParserFormatter,ConfigService } from '../../../../shared/services'
import { CarDetails } from '../../../../shared/model/car/car-details'
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-car-details',
  templateUrl: './car-details.component.html',
  styleUrls: ['./car-details.component.scss'],
  providers: [CustomNgbDateParserFormatter],
  animations: [routerTransition()]
})
export class CarDetailsComponent implements OnInit {

  public carId: number;
  public LT:string=ConfigService.languageType;
  public IsEditItem: boolean = false;
  public carDetails = new CarDetails();
  public registrationDate:any=null;
  public onRootDate:any=null;
  public UserInfo = JSON.parse(localStorage.getItem("car-system-user-info-option-b"));
  public userId=1;
  private modalRef: NgbModalRef;
  public  closeResult: string;
  constructor(private carService: CarService, private configService:ConfigService, private alertService: AlertService,private ngbDateParserFormatter: NgbDateParserFormatter,private customNgbDateParserFormatter: CustomNgbDateParserFormatter, private router: Router, private route: ActivatedRoute,private modalService: NgbModal) { }

  ngOnInit() {
    this.userId=this.UserInfo[0].Id;
    this.carId = this.route.snapshot.params["carId"];
    if (this.carId > 0) {
      this.IsEditItem = true;
      this.fnGetBus();
    } else {
      this.IsEditItem = false;
    }
  }

  fnGetBus() {
    this.alertService.fnLoading(true);
    this.carService.fnGetBus(this.userId,this.carId).then(
      (data: CarDetails[]) => {
        this.carDetails = data[0];
        this.registrationDate = this.customNgbDateParserFormatter.parse(this.carDetails.RegistrationDate||null);
        this.onRootDate=this.customNgbDateParserFormatter.parse(this.carDetails.OnRootDate||null);
        this.alertService.fnLoading(false);
      },
      (error: any) => {
        this.alertService.fnLoading(false);
        this.alertService.alert(this.LT=='bn'?'নেটওয়ার্ক সমস্যার কারণে সিস্টেমটি গাড়ির তথ্য প্রদর্শন করতে ব্যর্থ হয়েছে। অনুগ্রহপূর্বক আবার চেষ্টা করুন.':'System has failed to show car information because of network problem. Please try again.');
      }
    );
  }

  fnSaveBus() {
    //to check group name;
    if (this.carDetails.RegistrationNo == null || this.carDetails.RegistrationNo == "") {
      this.alertService.alert(this.LT=='bn'?'নিবন্ধন নম্বর প্রয়োজন। দয়া করে আবার এই ক্ষেত্রটি পর্যালোচনা করুন।':'Registration no. is required. Please review this field again.');
      return false;
    }else if (this.carDetails.CarTypeId == null || this.carDetails.Type == "") {
      this.alertService.alert(this.LT=='bn'?'গাড়ীর ধরন পছন্দ করুন, তারপর তথ্য সংরক্ষণ করুন।':'Car type is required. Please review this field again.');
      return false;
    }else if (this.carDetails.NoOfSeat == null) {
      this.alertService.alert(this.LT=='bn'?'গাড়ীর সিটের সংখ্যা বসান, তারপর তথ্য সংরক্ষণ করুন।':'Number of seat is required for Car. Please review this field again.');
      return false;
    }

    //this.carDetails.Update = new Date().toISOString().slice(0, 19).replace('T', ' '); 
    this.carDetails.Update = this.configService.getCurrentDate();  
    this.carDetails.CreatedBy=this.userId;     
    if (this.IsEditItem) {
      
    } else {
      this.carDetails.CarId=0;
    }

    this.alertService.fnLoading(true);
      this.carService.fnPostBus(this.carDetails).subscribe(
        (success: any) => {
          this.alertService.fnLoading(false);
          this.alertService.confirm(this.LT=='bn'?success._body.replace(/"/g,"") + ' আপনি কি গাড়ির তালিকায় ফিরে যেতে চান?':success._body.replace(/"/g,"")  +' Do you want to back in car list?'
            , () => {
              this.router.navigate(["./car/car-list"]);
            }
            , function () { });
        },
        (error: any) => {
          this.alertService.fnLoading(false);
          this.alertService.alert(this.LT=='bn'?'নেটওয়ার্ক সমস্যাটির কারণে সিস্টেম গাড়ির দেখাতে ব্যর্থ হয়েছে।':'System has failed to show car because of network problem.');
        }
      );
  }

  fnCreateNewProduct() {
    this.IsEditItem = false;
    this.carDetails = new CarDetails();
    this.carId = 0;
  }

  onSelectRegistrationDate(date: any) {
    if (date != null) {
      this.carDetails.RegistrationDate = this.ngbDateParserFormatter.format(date);
    }
  }

  onSelectOnRootDate(date: any) {
    if (date != null) {
      this.carDetails.OnRootDate = this.ngbDateParserFormatter.format(date);
    }
  }

  
public modalType:string;
configureableModalData:any[]=[];
  fnGenerateModal(content, actionName: string) {
    this.alertService.fnLoading(true)
    this.modalType = "Car type selection";
    //generate modal
    this.carService.fnGetCarTypes(this.userId).then((data: any) => {
      console.log("data", data);
      this.alertService.fnLoading(false)
      this.configureableModalData = data || [];

      this.modalRef = this.modalService.open(content);
      this.modalRef.result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    });

  }


  fnPtableModalCallBack(event: any) {
    console.log("event", event);
    if (this.modalType == "Car type selection") {
      this.carDetails.CarTypeId = event.record.CarTypeId;
      this.carDetails.Type = event.record.Type;
    }
    this.modalRef.close();
  }
  public configureableModalTable = {
    tableID: "messtage-history-table",
    tableClass: "table table-border ",
    tableName: this.LT=='bn'?'গাড়ির প্রকার নির্বাচন করুন':'Select Bus Type',
    tableRowIDInternalName: "ID",
    tableColDef: [
      { headerName: this.LT=='bn'?'গাড়ির ধরন':'Car Type', width: '40%', internalName: 'Type', sort: true, type: "" },
      { headerName: this.LT=='bn'?'বিবরণ':'Description', width: '45%', internalName: 'Description', sort: true, type: "" },
    ],
    enabledSearch: true,
    pageSize: 20,
    enabledPagination: false,
    enabledRadioBtn: true,
    enabledAutoScrolled: true,
    enabledCellClick: true,
    pTableStyle: {
      tableOverflowY: true,
      overflowContentHeight: '460px'
    }
  };

}
