using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Sandip.DAL;
using Sandip.Services;
using Sandip.ViewModel.Payment;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Sandip.Controllers.Accounts
{
    public class DailyPaymentController : ApiController
    {
        private CommonService _commonService = new CommonService();
        [Route("api/GetDailyPaymentList")]
        [HttpGet]
        public HttpResponseMessage GetDailyPaymentList(int UserId)
        {
            try

            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    var returnData = db.prGetDailyPaymentLog(UserId, 0, "All").ToList();
                    return Request.CreateResponse(HttpStatusCode.OK, returnData);
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "System has failed to show payment list. Please contact with admin.");
            }
        }

        [Route("api/GetDailyPayment")]
        [HttpGet]
        public HttpResponseMessage GetDailyPayment(int UserId, int PaymentId)
        {
            try

            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    var returnData = db.prGetDailyPaymentLog(UserId, PaymentId, "Single").ToList();
                    return Request.CreateResponse(HttpStatusCode.OK, returnData);
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "System has failed to show payment history. Please contact with admin.");
            }
        }

        [AllowAnonymous]
        [Route("api/PostPayment")]
        [HttpPost]
        public HttpResponseMessage PostPayment([FromBody] JObject request)
        {
            if (request != null)
            {
                var DCarLog = JsonConvert.DeserializeObject<prGetDailyPaymentLog_Result>(request.ToString());
                try
                {
                    //DateTime checkIn = null;
                    // DCarLog.CheckInDate==null?null: Datetime.Parse(DCarLog.CheckOutDate);
                    //  var dat2 = Convert.ToDateTime(DCarLog.CheckOutDate);
                    using (CarSystemEntities db = new CarSystemEntities())
                    {
                        var returnData = db.prSaveDailyPayment(DCarLog.PaymentId, DCarLog.CarLogId, DCarLog.PaymentAmount, DCarLog.SystemAmount, DCarLog.Notes, DCarLog.PaySlipId, DCarLog.PaymentStatus, DCarLog.ReceivedBy, DCarLog.ReceivedByName, DCarLog.ReceivedDate, DCarLog.Status, Int32.Parse( DCarLog.CreatedBy), DCarLog.Update, DCarLog.PaymentType).FirstOrDefault();
                        return Request.CreateResponse(HttpStatusCode.OK, returnData.ToString());
                    }
                }
                catch (Exception ex)
                {
                    return Request.CreateResponse(HttpStatusCode.InternalServerError, "System had filed to save payment information. Please try agian.");
                }
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Please correct your information and try again.");
            }

        }

        [AllowAnonymous]
        [Route("api/PostMultiPayment")]
        [HttpPost]
        public HttpResponseMessage PostMultiPayment([FromBody] JObject request, int userId)
        {
            if (request != null)
            {
                var DCarLog = JsonConvert.DeserializeObject<MultiPayment>(request.ToString());
                List<prGetIncomeReportDateRangeBusWiseSection_Result> carList = new List<prGetIncomeReportDateRangeBusWiseSection_Result>();
                prGetDailyPaymentLog_Result paymentLog = new prGetDailyPaymentLog_Result();
                carList = DCarLog.CarList;
                paymentLog = DCarLog.PaymentLog;

                User user= _commonService.GetUserById(Convert.ToInt32(userId));

                try
                {                    
                    using (CarSystemEntities db = new CarSystemEntities())
                    {
                        string returnData = "";
                        var carIdList =string.Join(",",carList.Select(x=>x.CarLogId));
                        var balance = db.prCheckAmountValidationForMultiPayment(paymentLog.PaymentAmount, carIdList.ToString(), userId).FirstOrDefault();
                        if (balance== paymentLog.PaymentAmount) {
                            foreach (prGetIncomeReportDateRangeBusWiseSection_Result car in carList)
                            {
                                var amount = car.TotalIncome - (car.PaymentAmount == null ? 0 : car.PaymentAmount);
                                returnData = db.prSaveMultiPayment(0, car.CarLogId, amount, amount, paymentLog.Notes, paymentLog.PaySlipId, "Paid", paymentLog.ReceivedBy, paymentLog.ReceivedByName, paymentLog.ReceivedDate, paymentLog.Status, Int32.Parse(paymentLog.CreatedBy), paymentLog.Update, paymentLog.PaymentType).FirstOrDefault();
                            }
                        }
                        else
                        {
                            returnData = user.Language == "bn" ? "আপনার দেওয়া টাকা এবং সিস্টেমের টাকা সমান নয়, অনুগ্রহ করে পর্যালোচনা করে দেখুন।" : "Your amount does not match with system amount, please verify your amount again.";
                        }
                       
                        
                        return Request.CreateResponse(HttpStatusCode.OK, returnData.ToString());
                    }
                }
                catch (Exception ex)
                {
                    return Request.CreateResponse(HttpStatusCode.InternalServerError, "System had filed to save payment information. Please try agian.");
                }
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Please correct your information and try again.");
            }


        }


        [Route("api/DeletePayment")]
        [HttpGet]
        public HttpResponseMessage DeletePayment(int PaymentId)
        {
            try

            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                   // db.Database.ExecuteSqlCommand("Update DailyCarHistories set Status='Delete' Where DriverId=" + CarLogId);
                    return Request.CreateResponse(HttpStatusCode.OK, "Driver information has deleted successfully.");
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "System has failed to delete payment log information. Please try agian.");
            }
        }
    }
}
