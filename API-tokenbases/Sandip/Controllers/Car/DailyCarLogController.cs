using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Sandip.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Sandip.Controllers.Car
{
    public class DailyCarLogController : ApiController
    {
        [Route("api/GetDilyCarLogList")]
        [HttpGet]
        public HttpResponseMessage GetDilyCarLogList(int UserId)
        {
            try

            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    var returnData = db.prGetDailyCarLog(UserId, 0, "All").ToList();
                    return Request.CreateResponse(HttpStatusCode.OK, returnData);
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "System has failed to show bus log list. Please contact with admin.");
            }
        }

        [Route("api/GetDilyCarLogListByDate")]
        [HttpGet]
        public HttpResponseMessage GetDilyCarLogListByDate(int UserId,string Type,DateTime FromDate,DateTime ToDate )
        {
            try

            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    var returnData = db.prGetDailyCarLogDateRange(UserId, 0, FromDate, ToDate, Type).ToList();
                    return Request.CreateResponse(HttpStatusCode.OK, returnData);
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "System has failed to show bus log list. Please contact with admin.");
            }
        }

        [Route("api/GetDilyCarLog")]
        [HttpGet]
        public HttpResponseMessage GetDilyCarLog(int UserId, int CarLogId)
        {
            try

            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    var returnData = db.prGetDailyCarLog(UserId, CarLogId, "Single").ToList();
                    return Request.CreateResponse(HttpStatusCode.OK, returnData);
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "System has failed to show bus log list. Please contact with admin.");
            }
        }
        [Route("api/GetDilyCarLogOnDemand")]
        [HttpGet]
        public HttpResponseMessage GetDilyCarLogOnDemand(int UserId, int CarLogId,string Type)
        {
            try

            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    var returnData = db.prGetDailyCarLog(UserId, CarLogId, Type).ToList();
                    return Request.CreateResponse(HttpStatusCode.OK, returnData);
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "System has failed to show bus log list. Please contact with admin.");
            }
        }

        [Route("api/UpdateDilyCarLog")]
        [HttpGet]
        public HttpResponseMessage UpdateDilyCarLog(int UserId, int CarLogId,string AdditionalId, string Type)
        {
            try

            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    var returnData = db.prUpdateDailyCarLog(UserId, CarLogId, AdditionalId, Type).FirstOrDefault();
                    return Request.CreateResponse(HttpStatusCode.OK, returnData);
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "System has failed to show bus log list. Please contact with admin.");
            }
        }
        [AllowAnonymous]
        [Route("api/PostDailyCarLog")]
        [HttpPost]
        public HttpResponseMessage PostDailyCarLog([FromBody] JObject request)
        {
            if (request != null)
            {
                var DCarLog = JsonConvert.DeserializeObject<DailyCarHistory>(request.ToString());
                try
                {
                    //DateTime checkIn = null;
                   // DCarLog.CheckInDate==null?null: Datetime.Parse(DCarLog.CheckOutDate);
                  //  var dat2 = Convert.ToDateTime(DCarLog.CheckOutDate);
                    using (CarSystemEntities db = new CarSystemEntities())
                    {
                        var returnData = db.prSaveDailyCarLog(DCarLog.CarLogId, DCarLog.CarId, DCarLog.DriverId, DCarLog.RootId, DCarLog.CheckInDate, DCarLog.CheckOutDate, DCarLog.CheckInTime, DCarLog.CheckOutTime, DCarLog.TripNo, DCarLog.TotalDistance, Convert.ToInt32(DCarLog.CheckInBy), Convert.ToInt32(DCarLog.CheckOutBy),  DCarLog.CreatedBy, DCarLog.IsUnwantedReturn, DCarLog.ReasonForReturn, DCarLog.Status, DCarLog.Update, DCarLog.RouteStartPoint, DCarLog.ExceptioalAmount, DCarLog.TripType, DCarLog.DifferentRouteIncome, DCarLog.DifferentRouteDistance, DCarLog.AdditionalIncomeType, DCarLog.IsUnOfficialDay).FirstOrDefault();
                        return Request.CreateResponse(HttpStatusCode.OK, returnData.ToString());
                    }
                }
                catch (Exception ex)
                {
                    return Request.CreateResponse(HttpStatusCode.InternalServerError, "System had filed to save driver information. Please try agian.");
                }
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Please correct your information and try again.");
            }


        }

        [Route("api/PostDailyCarLogOnDemand")]
        [HttpPost]
        public HttpResponseMessage PostDailyCarLogOnDemand([FromBody] JArray request,int UserId,string Type)
        {
            if (request != null)
            {
                var DCarLog = JsonConvert.DeserializeObject<DailyCarHistory[]>(request.ToString());
                try
                {
                    //DateTime checkIn = null;
                    // DCarLog.CheckInDate==null?null: Datetime.Parse(DCarLog.CheckOutDate);
                    //  var dat2 = Convert.ToDateTime(DCarLog.CheckOutDate);
                    using (CarSystemEntities db = new CarSystemEntities())
                    {
                        //var returnData = db.prSaveDailyCarLog(DCarLog.CarLogId, DCarLog.CarId, DCarLog.DriverId, DCarLog.RootId, DCarLog.CheckInDate, DCarLog.CheckOutDate, DCarLog.CheckInTime, DCarLog.CheckOutTime, DCarLog.TripNo, DCarLog.TotalDistance, Convert.ToInt32(DCarLog.CheckInBy), Convert.ToInt32(DCarLog.CheckOutBy), DCarLog.CreatedBy, DCarLog.IsUnwantedReturn, DCarLog.ReasonForReturn, DCarLog.Status, DCarLog.Update).FirstOrDefault();
                        foreach (DailyCarHistory dCarLog in DCarLog)
                        {
                            //returnData = db.prSavePaySlip(pSlip.PaySlipId, pSlip.SlipNo, pSlip.BookNo, pSlip.Amount, pSlip.Status, Int32.Parse(pSlip.CreatedBy), pSlip.Update).FirstOrDefault();
                            db.Database.ExecuteSqlCommand("Update DailyCarHistories set Status='Approved', ApprovedBy=" + UserId + " Where CarLogId=" + dCarLog.CarLogId);
                        }
                        return Request.CreateResponse(HttpStatusCode.OK, "Your request executed successfully.");
                    }
                }
                catch (Exception ex)
                {
                    return Request.CreateResponse(HttpStatusCode.InternalServerError, "System had filed to save driver information. Please try agian.");
                }
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Please correct your information and try again.");
            }


        }
        [Route("api/DeleteCarLog")]
        [HttpGet]
        public HttpResponseMessage DeleteCarLog(int CarLogId)
        {
            try

            {
                using (CarSystemEntities db = new CarSystemEntities())
                {
                    db.Database.ExecuteSqlCommand("Update DailyCarHistories set Status='Delete' Where DriverId=" + CarLogId);
                    return Request.CreateResponse(HttpStatusCode.OK, "Driver information has deleted successfully.");
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "System has failed to delete bus log information. Please try agian.");
            }
        }
    }
}
