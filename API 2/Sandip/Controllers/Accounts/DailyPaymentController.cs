using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Sandip.DAL;
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
