import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { AlertService } from '../../../shared/modules/alert/alert.service'
import { AdminService, CarService, CommonService, ConfigService, CustomNgbDateParserFormatter, StoreService } from '../../../shared/services'
import { Job, StoreInfo } from '../../../shared/model/store'
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal, NgbModalRef, ModalDismissReasons, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-parts-allocation',
  templateUrl: './parts-allocation.component.html',
  styleUrls: ['./parts-allocation.component.scss'],
  providers: [CustomNgbDateParserFormatter],
  animations: [routerTransition()]
})
export class PartsAllocationComponent implements OnInit {
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
      // this.JobDate = this.customNgbDateParserFormatter.parse(this.dailyLogDetails.CheckInDate || null);
      this.jobDetails.JobDate = this.ngbDateParserFormatter.format(this.JobDate);
      //this.jobDetails.JobCompletedDate = this.ngbDateParserFormatter.format(this.JobDate);
      this.IsEdit = false;
    }
  }

  fnGetJobDetails() {
    this.alertService.fnLoading(true);
    this.adminService.fnGetEmployee(this.userId, this.jobId).subscribe(
      (data: Job[]) => {
        this.jobDetails = data[0];
        this.alertService.fnLoading(false);
      },
      (error: any) => {
        this.alertService.fnLoading(false);
        this.alertService.alert(this.LT == 'bn' ? ' সিস্টেম কর্মচারী দেখাতে ব্যর্থ হয়েছে।' : 'System has failed to show employee because of network problem.');
      }
    );
  }

  // fnSaveJobDetails() {   

  //   this.jobDetails.Created = this.configService.getCurrentDate();
  //   this.jobDetails.CreatedBy = this.userId;

  //   this.alertService.fnLoading(true);
  //   this.storeService.fnPostJobInfo(this.jobDetails).subscribe(
  //     (success: any) => {
  //       this.alertService.fnLoading(false);
  //       this.alertService.confirm(this.LT == 'bn' ? success._body.replace(/"/g, "") + ' আপনি কি জবের তালিকায় ফিরে যেতে চান?' : success._body.replace(/"/g, "") + ' Do you want to back in Job list?'
  //         , () => {
  //           this.router.navigate(["./store/jobs"]);
  //         }
  //         , function () { });
  //     },
  //     (error: any) => {
  //       this.alertService.fnLoading(false);
  //       this.alertService.alert(this.LT == 'bn' ? ' সিস্টেম জবের তালিকা দেখাতে ব্যর্থ হয়েছে।' : 'System has failed to show Job list.');
  //     }
  //   );
  // }

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
    console.log(data);
    if (this.jobDetails.Status == "Completed") {
      this.alertService.alert(this.LT == 'bn' ? 'জবটি সম্পুর্ন হয়েছে সুতরাং আপনি কোন যন্ত্রাংশ যোগ অথবা মুছে ফেলতে পারবেন না। অনুগ্রহপূর্বক অন্য চেষ্টা করুন.' : 'Job has been completed so you have no permission to add or remove any parts from the list. Please contact with admin.');
      return false
    }

    if (event.action == "delete-item") {
      this.alertService.confirm(this.LT == 'bn' ? 'আপনি কি <b>' + data.PartsName + '</b> যন্ত্রাংশের তথ্য মুছে ফেলতে চান? ' : 'Do you want to delete parts <b>' + data.PartsName + "</b>?",
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
      this.alertService.confirm(this.LT == 'bn' ? 'আপনি কি <b>' + data.PartsName + '</b> যন্ত্রাংশের তথ্য সম্পাদনা করতে চান?' : 'Do you want to edit information of parts <b>' + data.PartsName + "</b>?",
        () => {
          this.partsId = data.PartsId;
          this.partsName = data.PartsName;
          this.partsCode = data.PartsCode;
          this.availableParts = 0;
          this.numberOfParts = data.QuantityOut;
          this.storeInfoId = data.StoreInfoId;
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
      this.configureableModalTable.tableName = this.LT == 'bn' ? 'কারিগরের নাম নির্বাচন করুন' : 'Select Mechanic';
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
    } else if (this.modalType == "Job-list") {
      this.configureableModalTable.tableName = this.LT == 'bn' ? 'জবের তালিকা' : 'Parts List.';
      this.configureableModalTable.tableColDef = [
        { headerName: this.LT == 'bn' ? 'জব নম্বর' : 'Job No ', width: '10%', internalName: 'JobId', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'জবের তারিখ' : 'Job Date ', width: '10%', internalName: 'JobDate', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'গাড়ির নং' : 'Car No', width: '10%', internalName: 'RegistrationNo', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'গাড়ির অবস্থা' : 'Car Condition', width: '10%', internalName: 'BusStatus', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'জবের বিবরন' : 'Job Description', width: '20%', internalName: 'JobDescription', sort: false, type: "" },
        { headerName: this.LT == 'bn' ? 'কারিগরের  নাম' : 'Assigned Mechanic', width: '10%', internalName: 'AssignedMechanicName', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'মন্তব্য' : 'Remark', width: '10%', internalName: 'Remark', sort: false, type: "" },
        { headerName: this.LT == 'bn' ? 'সম্পূর্নের তারিখ' : 'Completed Date ', width: '10%', internalName: 'JobCompletedDate', sort: true, type: "" },
        { headerName: this.LT == 'bn' ? 'জবের অবস্থা' : 'Status', width: '15%', internalName: 'Status', sort: true, type: "" },
      ]
      this.storeService.fnGetJobList(this.userId, '10-10-1990', '10-10-2020', 0, 'All').subscribe(
        (data: Job[]) => {
          this.alertService.fnLoading(false)
          this.configureableModalData = data || [];
          this.configureableModalData.forEach((rec: any) => {
            rec.JobDate = rec.JobDate.split("T")[0];
          })
          this.currentPartsList = data || [];
          this.modalRef = this.modalService.open(content, { size: 'lg', backdrop: 'static' });
          this.modalRef.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
          }, (reason) => {
            //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          });
        },
        (error: any) => {
          this.alertService.fnLoading(false);
          this.alertService.alert(error._body);
        }
      );
    }
  }

  public storeInfoId: number = 0;
  public partsId: number;
  public partsName: string;
  public partsCode: string;
  public availableParts: number = 0;
  public numberOfParts: number;
  public currentPartsList = [];
  public jobPartsList = [];

  fnAddNewParts() {
    let store: StoreInfo = new StoreInfo();
    if (this.jobDetails.JobId == 0 || this.jobDetails.JobId == null) {
      this.alertService.alert(this.LT == 'bn' ? "জবের লিষ্ট থেকে জব পছন্দ করুন।" : "Please select any of the job then proceed.");
      return false;
    }
    if (this.partsId == 0 || this.partsId == null) {
      this.alertService.alert(this.LT == 'bn' ? "যন্ত্রাংশ পছন্দ করুন তারপর যন্ত্রাংশটি সংরক্ষণ করার চেষ্টা করুন।" : "Please select the parts from the parts list.");
      return false;
    }
    if (this.numberOfParts == 0 || this.numberOfParts == null) {
      this.alertService.alert(this.LT == 'bn' ? "দয়াকরে আপনি ইংরেজিতে কোন সংখ্যা প্রদান করুন।" : "Please input the number of parts which you want to take.");
      return false;
    }

    if (+this.numberOfParts > +this.availableParts && this.storeInfoId == 0) {
      this.alertService.alert(this.LT == 'bn' ? "আপনি যে পরিমাণ যন্ত্রাংশ ডিমান্ড করছেন তা স্টোরে পর্যাপ্ত নাই।" : "Number of parts can't be large amount of available parts. Please review.");
      return false;
    }

    store.StoreInfoId = this.storeInfoId;
    store.JobIdRef = this.jobDetails.JobId.toString();
    store.PartsId = this.partsId;
    store.QuantityOut = this.numberOfParts;
    store.Status = "Active";
    store.CreatedBy = this.userId;
    store.Created = this.configService.getCurrentDate();
    this.alertService.fnLoading(true);
    this.storeService.fnPostStoreOut(store).subscribe((data: any) => {
      this.alertService.fnLoading(false);
      this.numberOfParts = 0;
      this.alertService.confirmAlert(data._body,
        () => {
          this.fnGetStoreInfoById();
        });


    },
      (error: any) => {
        this.alertService.fnLoading(false);
      });

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
        }
        this.alertService.alert(mgs.replace(/"/g, ""));
        return false;
      },
      (error: any) => {
        this.alertService.fnLoading(false);
        this.alertService.alert(this.LT == 'bn' ? ' সিস্টেম জবের তথ্য হালনাগাদ করতে ব্যর্থ হয়েছে।' : 'System has failed to save Job information.');
      }
    );
  }

  fnGetStoreInfoById() {
    this.alertService.fnLoading(true);
    this.storeService.fnGetStoreInfoById(this.userId, this.jobDetails.JobId).subscribe((data: any) => {
      console.log("data", data);
      this.jobPartsList = data || [];
      this.alertService.fnLoading(false);
    },
      (error: any) => {
        this.alertService.fnLoading(false);
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
      console.log(event.record);
      if (event.record.Balance > 0) {
        this.partsId = event.record.PartsId;
        this.partsName = event.record.PartsName;
        this.numberOfParts = 0;
        this.partsCode = event.record.PartsCode;
        this.availableParts = event.record.Balance;
        this.storeInfoId = 0;
      } else {
        this.alertService.alert("There are no available balance in store.");
      }

    } else if (this.modalType == "Job-list") {
      this.jobDetails = event.record;
      this.fnGetStoreInfoById();
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
      { headerName: this.LT == 'bn' ? 'যন্ত্রাংশের  কোড' : 'Parts Code ', width: '15%', internalName: 'PartsCode', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'যন্ত্রাংশের একক মুল্য' : 'Unit Price ', width: '20%', internalName: 'UnitPrice', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'একক' : 'Units', width: '20%', internalName: 'Units', sort: true, type: "" },
      { headerName: this.LT == 'bn' ? 'যন্ত্রাংশের পরিমাণ' : 'Quantity', width: '10%', internalName: 'QuantityOut', sort: false, type: "" },
      // { headerName: this.LT == 'bn' ? 'অবশিষ্ট' : 'Balance', width: '20%', internalName: 'Balance', sort: true, type: "" },
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
}
