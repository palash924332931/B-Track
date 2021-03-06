import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../../router.animations';
import { AlertService } from '../../../../shared/modules/alert/alert.service'
import { AdminService, CarService, CommonService, ConfigService, CustomNgbDateParserFormatter, StoreService } from '../../../../shared/services'
import { Job } from '../../../../shared/model/store'
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal, NgbModalRef, ModalDismissReasons, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss'],
  providers: [CustomNgbDateParserFormatter],
  animations: [routerTransition()]
})
export class JobDetailsComponent implements OnInit {
  public LT: string = ConfigService.languageType;
  public jobId: number;
  public IsEdit: boolean = false;
  public jobDetails = new Job();
  public UserInfo = JSON.parse(localStorage.getItem("car-system-user-info-option-b"));
  public userId = 1;
  public JobDate = null;
  public JobCompletedDate = null;
  private modalRef: NgbModalRef;
  public modalType: string;
  public closeResult: string;
  public configureableModalData: any[] = [];
  public jobStatus = 'New Job';
  constructor(private adminService: AdminService, private configService: ConfigService, private alertService: AlertService, private router: Router, private route: ActivatedRoute, private storeService: StoreService, private customNgbDateParserFormatter: CustomNgbDateParserFormatter, private ngbDateParserFormatter: NgbDateParserFormatter, private modalService: NgbModal, public carService: CarService) { }

  ngOnInit() {
    this.userId = this.UserInfo[0].Id;
    this.jobId = this.route.snapshot.params["jobId"];
    let date2 = this.configService.getCurrentDate();
    let dateTime = new Date();
    this.JobDate = this.customNgbDateParserFormatter.parse(date2 || null);
    if (this.jobId > 0) {
      this.IsEdit = true;
      this.fnGetJobDetails();
    } else {
      this.jobDetails.JobDate = this.ngbDateParserFormatter.format(this.JobDate);
      //this.jobDetails.JobCompletedDate = this.ngbDateParserFormatter.format(this.JobDate);
      this.IsEdit = false;
    }
  }

  fnGetJobDetails() {
    this.alertService.fnLoading(true);
    this.storeService.fnGetJobList(this.userId, '10-10-1990', '10-10-2020', this.jobId, 'Single').subscribe(
      (data: Job[]) => {

        console.log("job details: ", data);
        debugger;
        this.jobDetails = data[0];
        this.JobDate = this.customNgbDateParserFormatter.parse(this.jobDetails.JobDate || null);
        this.JobCompletedDate= this.customNgbDateParserFormatter.parse(this.jobDetails.JobCompletedDate || null);
        this.alertService.fnLoading(false);
      },
      (error: any) => {
        this.alertService.fnLoading(false);
        this.alertService.alert(this.LT == 'bn' ? ' সিস্টেম কর্মচারী দেখাতে ব্যর্থ হয়েছে।' : 'System has failed to show employee because of network problem.');
      }
    );
  }

  fnSaveJobDetails() {
    this.jobDetails.Created = this.configService.getCurrentDate();
    this.jobDetails.CreatedBy = this.userId;

    this.alertService.fnLoading(true);
    this.storeService.fnPostJobInfo(this.jobDetails).subscribe(
      (success: any) => {
        this.alertService.fnLoading(false);
        let mgs = "";
        if ((success._body).indexOf("|") > -1) {
          mgs = success._body.split("|")[1];
          this.jobDetails.JobId = success._body.split("|")[0];
          this.IsEdit = true;
        }
        this.alertService.confirm(this.LT == 'bn' ? mgs.replace(/"/g, "") + ' আপনি কি জবের তালিকায় ফিরে যেতে চান?' : success._body.replace(/"/g, "") + ' Do you want to back in Job list?'
          , () => {
            this.router.navigate(["./store/jobs"]);
          }
          , function () { });
      },
      (error: any) => {
        this.alertService.fnLoading(false);
        this.alertService.alert(this.LT == 'bn' ? ' সিস্টেম জবের তালিকা দেখাতে ব্যর্থ হয়েছে।' : 'System has failed to show Job list.');
      }
    );
  }

  fnCreateNewJob() {
    this.IsEdit = false;
    this.jobDetails = new Job();
    this.jobId = 0;
  }

  onSelectJobDate(date: any) {
    if (date != null) {
      this.jobDetails.JobDate = this.ngbDateParserFormatter.format(date);
    } else {
      this.jobDetails.JobDate = null;
    }
  }

  onSelectJobCompletedDate(date: any) {
    if (date != null) {
      this.jobDetails.JobCompletedDate = this.ngbDateParserFormatter.format(date);
    } else {
      this.jobDetails.JobCompletedDate = null;
    }
  }

  fnPtableCallBack(event: any) {
    let data = event.record;
    if (event.action == "delete-item") {
      this.alertService.confirm(this.LT == 'bn' ? 'আপনি কি <b>' + data.RegistrationNo + '</b> বাসের তথ্য মুছে ফেলতে চান? ' : 'Do you want to delete bus which registration no <b>' + data.RegistrationNo + "</b>?",
        () => {
          this.alertService.fnLoading(true);
          // this.carService.fnDeleteBus(data.CarId).subscribe(
          //   (success: any) => {
          //     this.alertService.fnLoading(false);
          //     this.fnGetVendors();             
          //   },
          //   (error: any) => {
          //     this.alertService.fnLoading(false);
          //     this.alertService.alert(this.LT == 'bn' ? 'সিস্টেম কর্মচারী তথ্য মুছে ফেলতে ব্যর্থ হয়েছে। অনুগ্রহপূর্বক আবার চেষ্টা করুন.' : 'System has failed to delete employee information. Please try again.');
          //   }
          // );
        }
        , function () { })
    } else if (event.action == "edit-item") {
      this.alertService.confirm(this.LT == 'bn' ? 'আপনি কি <b>' + data.RegistrationNo + '</b> বাস সম্পাদনা করতে চান?' : 'Do you want to edit information of bus <b>' + data.RegistrationNo + "</b>?",
        () => {
          this.router.navigate(["./car/car-list/" + data.CarId]);
        }
        , function () { })
    }
  }
  public jobItemList: any[] = [];

  fnGenerateModal(content, actionName: string) {
    this.alertService.fnLoading(true)
    this.modalType = actionName;
    //generate modal
    if (this.modalType == "bus-list") {
      this.configureableModalTable.tableName = this.LT == 'bn' ? 'গাড়ি নির্বাচন করুন' : 'Select Bus from the list.';
      this.configureableModalTable.tableColDef = [
        { headerName: this.LT == 'bn' ? 'নিবন্ধন নম্বর' : 'Registration No ', width: '25%', internalName: 'RegistrationNo', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'গাড়ির ধরণ' : 'Bus Type ', width: '25%', internalName: 'Type', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'বিবরণ' : 'Description', width: '25%', internalName: 'Description', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'অবস্থা' : 'Status', width: '25%', internalName: 'Status', sort: true, type: "" },
      ]

      this.carService.fnGetBuses(this.userId).then((data: any) => {
        console.log("data", data);
        this.alertService.fnLoading(false);
        data = data.filter((rc: any) => { if (rc.Status == 'Active') { return true; } else { return false; } }) || [];
        this.configureableModalData = data || [];

        this.modalRef = this.modalService.open(content, { size: 'lg' });
        this.modalRef.result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          this.alertService.fnLoading(false);
        });
      });
    }
    else if (this.modalType == "Select Driver") {
      this.configureableModalTable.tableName = this.LT == 'bn' ? 'চালক নির্বাচন করুন' : 'Select Driver from list.';
      this.configureableModalTable.tableColDef = [
        { headerName: this.LT == 'bn' ? 'কর্মচারীর আইডি' : 'Employee Id ', width: '25%', internalName: 'EmployeeId', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'চালকের নাম' : 'Name ', width: '25%', internalName: this.LT == 'bn' ? 'NameInBangla' : 'Name', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'মোবাইল নম্বর' : 'Phone Number', width: '25%', internalName: 'PhoneNo', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'ড্রাইভিং লাইসেন্স' : 'Driving LI', width: '25%', internalName: 'Status', sort: true, type: "" },
      ]

      this.carService.fnGetDrivers(this.userId).then((data: any) => {
        console.log("data", data);
        this.alertService.fnLoading(false)
        this.configureableModalData = data || [];

        this.modalRef = this.modalService.open(content, { size: 'lg' });
        this.modalRef.result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      });
    }
    else if (this.modalType == "Select Parts") {
      this.configureableModalTable.tableName = this.LT == 'bn' ? 'যন্ত্রাংশের তালিকা' : 'Parts List.';
      this.configureableModalTable.tableColDef = [
        { headerName: this.LT == 'bn' ? 'যন্ত্রাংশের নাম' : 'Parts Name ', width: '20%', internalName: 'PartsName', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'যন্ত্রাংশের কোড' : 'Parts Code ', width: '15%', internalName: 'PartsCode', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'যন্ত্রাংশের ধরন ' : 'Parts Size ', width: '15%', internalName: 'PartsSize', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'একক মুল্য ' : 'Unit Price ', width: '20%', internalName: 'UnitPrice', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'ব্যবহারযোগ্য পরিমাণ' : 'Available Amount', width: '15%', internalName: 'Balance', sort: true, type: "" },
      ]

      this.storeService.fnGetPatsList(this.userId).subscribe((data: any) => {
        console.log("data", data);
        this.alertService.fnLoading(false)
        this.configureableModalData = data || [];
        this.currentPartsList = data || [];

        this.modalRef = this.modalService.open(content, { size: 'lg', backdrop: 'static' });
        this.modalRef.result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      }, (error: any) => {
        this.alertService.fnLoading(false);
      });
    }
    else if (this.modalType == "Select Employee List" || this.modalType == "Select Employee checkedOut" || this.modalType == "Select Assigned Mechanic") {
      this.configureableModalTable.tableName = this.LT == 'bn' ? 'সূচনাকারী নির্বাচন করুন' : 'Select Job Creator.';
      this.configureableModalTable.tableColDef = [
        { headerName: this.LT == 'bn' ? 'কর্মচারীর আইডি' : 'Employee Id ', width: '25%', internalName: 'EmployeeId', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'নাম ' : 'Name ', width: '25%', internalName: 'Name', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'পদবী' : 'Phone Number', width: '25%', internalName: 'RoleName', sort: true, type: "" },
      ]

      this.adminService.fnGetEmployees(this.userId).subscribe((data: any) => {
        console.log("data", data);
        this.alertService.fnLoading(false)
        this.configureableModalData = data || [];

        this.modalRef = this.modalService.open(content);
        this.modalRef.result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      }, (error: any) => {
        this.alertService.fnLoading(false);
      });
    }
  }

  public partsId: number;
  public partsName: string;
  public availableParts: string;
  public numberOfParts: number;
  public currentPartsList = [];
  public jobPartsList = [];

  fnAddNewParts() {
    if (this.partsId == 0 || this.partsId == null) {
      this.alertService.alert("Please select the parts from the parts list.");
      return false;
    }
    if (this.numberOfParts == 0 || this.numberOfParts == null) {
      this.alertService.alert("Please imput the number of parts which you want to take.");
      return false;
    }

    this.currentPartsList.forEach(element => {
      if (element.PartsId == this.partsId) {
        this.jobPartsList.push({
          Id: 0, JobId: this.jobId, PartsId: this.partsId, PartsName: element.PartsName, PartsSize: element.PartsSize, UnitPrice: element.UnitPrice, Quantity: this.numberOfParts
          , VendorId: 0, VendorName: "", Status: 'Availale', Balance: Number(element.Balance) - this.numberOfParts
        });
      }
    });



  }

  fnPtableModalCallBack(event: any) {
    console.log("event", event);
    if (this.modalType == "bus-list") {
      this.jobDetails.CarId = event.record.CarId;
      this.jobDetails.RegistrationNo = event.record.RegistrationNo;
    } else if (this.modalType == "Select Driver") {
      this.jobDetails.DriverId = event.record.DriverId;
      this.jobDetails.DriverName = event.record.Name;
    } else if (this.modalType == "Select Assigned Mechanic") {
      this.jobDetails.AssignedMechanic = event.record.Id;
      this.jobDetails.AssignedMechanicName = event.record.Name;
    } else if (this.modalType == "Select Parts") {
      this.partsId = event.record.PartsId;
      this.partsName = event.record.PartsName;
      this.numberOfParts = 0;
    }

    this.modalRef.close();
  }

  public jobItemListTableBind = {
    tableID: "messtage-history-table",
    tableClass: "table table-border ",
    tableName: this.LT == 'bn' ? 'যন্ত্রাংশের  তালিকা' : 'List of Parts',
    tableRowIDInternalName: "CarId",
    tableColDef: [
      { headerName: this.LT == 'bn' ? 'যন্ত্রাংশের  নাম' : 'Parts Name ', width: '15%', internalName: 'PartsName', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'যন্ত্রাংশের মুল্য' : 'Unit Price ', width: '20%', internalName: 'UnitPrice', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'একক' : 'Units', width: '20%', internalName: 'Units', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'যন্ত্রাংশের পরিমাণ' : 'Quantity', width: '10%', internalName: 'Quantity', sort: false, type: "" },
      { headerName: this.LT == 'bn' ? 'অবশিষ্ট' : 'Balance', width: '20%', internalName: 'Balance', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'অবস্থা' : 'Status', width: '15%', internalName: 'Status', sort: true, type: "" }
    ],
    enabledSearch: false,
    enabledSerialNo: true,
    pageSize: 15,
    enabledPagination: true,
    enabledEditBtn: true,
    enabledCellClick: true,
    enabledColumnFilter: true,
  };

  public configureableModalTable = {
    tableID: "messtage-history-table",
    tableClass: "table table-border ",
    tableName: this.LT == 'bn' ? 'কর্মচারীর পদবি নির্বাচন করুন' : 'Select Employee Role',
    tableRowIDInternalName: "ID",
    tableColDef: [
      { headerName: this.LT == 'bn' ? 'পদবি' : 'Role Title ', width: '40%', internalName: 'Name', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'যিনি তৈরী করেছেন' : 'Created By', width: '45%', internalName: 'CreatedByName', sort: true, type: "" },
    ],
    enabledSearch: true,
    pageSize: 10,
    enabledPagination: false,
    enabledRadioBtn: true,
    enabledAutoScrolled: true,
    enabledCellClick: true,
    pTableStyle: {
      tableOverflowY: true,
      overflowContentHeight: '460px'
    }
  };

  fnPrintJobLog() {
    let printContents, popupWin;
    /*
    <tr> <td colspan="2" align="center">জোয়ারসাহারা বাস ডিপো </td> </tr>
          <tr> <td colspan="2" align="center">খিলক্ষেত, ঢাকা।</td> </tr>
    */
    printContents = `<table style="width:100%">
    <tr>
        <td colspan="2" align="center" style="font-size: 28px; font-weight: 600;">বাংলাদেশ সড়ক পরিবহন কর্পোরেশন </td>
    </tr>
    <tr> 
     <td colspan="2" align="center">
         রিকুইজিশন স্লিপ (শাখা অফিস সমূহের জন্য) ক্রমিক নং ........................তাং <b>  ${this.jobDetails.JobDate} </b> নং <b>  ${this.jobDetails.JobId} </b>
     </td>
    </tr>
    <tr>
        <td align="center" colspan="2">
        শাখা............................................সেকশন...................................................................................                 
        </td>
    </tr>
    <tr>
        <td colspan="2">
            জব নং  <b>${this.jobDetails.JobId} </b> গাড়ীর নং  <b> ${this.jobDetails.RegistrationNo}</b>
        </td>
    </tr>
    <tr>
        <td colspan="2" align="center">
           <table border="1px solid black" style="border-collapse:collapse;width:100%">
                <tr>
                    <td rowspan="2">ক্রমিক নং</td>
                    <td rowspan="2">নাম ও বিবরণ</td>
                    <td rowspan="2">পার্ট নং কোড নং</td>
                    <td rowspan="2">একক</td>
                    <td colspan="2">পরিমাণ</td>
                    <td rowspan="2" colspan="2">একক মূল্য</td>
                    <td rowspan="2" colspan="2">মোট মূল্য</td>
                    <td rowspan="2">বিলির পর মজুত</td>
                    <td rowspan="2">মন্তব্য</td>
                </tr>
               <tr>
                   <td>(চাহিদা</td>
                   <td>বিলি</td>
               </tr>
                <tr>
                    <td>১</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>২</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>৩</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>৪</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>৫</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>৬</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>৭</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
    </tr>
</table>
      `;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
        <html>
          <head>
            <title>জবের বিবরন (system generated:B-Track)</title>
            <style>
            //........Customized style.......
            </style>
          </head>
      <body onload="window.print();window.close()">${printContents}</body>
        </html>`);
    popupWin.document.close();
  }
}

