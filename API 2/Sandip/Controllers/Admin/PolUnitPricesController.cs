
using Sandip.DAL;
using Sandip.Repositories.PolRepositories;
using Sandip.Services;
using Sandip.Services.Admin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Sandip.Controllers.Admin
{
    public class PolUnitPricesController : ApiController
    {
        private CommonService _commonService = new CommonService();
        //private CarSystemEntities _context = new CarSystemEntities();
        //private PolUnitPriceRepository _polUnitPriceRepo = new PolUnitPriceRepository(_context);
        private User _user;
        [Route("api/GetPolUnitPrices")]
        [HttpGet]
        public HttpResponseMessage GetPolUnitPrices(int userId)
        {
            try
            {
                _user = _commonService.GetUserById(userId);
                PolUnitPricesService _polUnitPriceService = new PolUnitPricesService(_user);
                IEnumerable<POLUnitPrice> polUnitPrices = _polUnitPriceService.GetPolUnitPrices();
                return Request.CreateResponse(HttpStatusCode.OK, polUnitPrices);

            }
            catch (Exception ex)
            {                
                return Request.CreateResponse(HttpStatusCode.BadRequest, _user.Language == "bn"?"সিস্টেম তথ্য দেখাতে ব্যর্থ হয়েছে। আপনি আবার চেষ্টা করুন।":"System has failed to show POL prices list. Please contact with admin.");
            }
        }

        [Route("api/GetPolUnitPriceById")]
        [HttpGet]
        public HttpResponseMessage GetPolUnitPriceById(int polUnitPriceId, int userId) {
            try
            {
                _user = _commonService.GetUserById(userId);
                PolUnitPricesService _polUnitPriceService = new PolUnitPricesService(_user);
                POLUnitPrice polUnitPrice = _polUnitPriceService.GetPolUnitPriceById(polUnitPriceId);
                return Request.CreateResponse(HttpStatusCode.OK, polUnitPrice);

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, _user.Language == "bn" ? "সিস্টেম তথ্য দেখাতে ব্যর্থ হয়েছে। আপনি আবার চেষ্টা করুন।" : "System has failed to show POL prices list. Please contact with admin.");
            }
        }

        [Route("api/PostPolUnitPrice")]
        [HttpPost]
        public HttpResponseMessage PostPolUnitPrice([FromBody] JObject request) {
            int message ;
            try
            {
                POLUnitPrice polUnitPrice = JsonConvert.DeserializeObject<POLUnitPrice>(request.ToString());
                _user = _commonService.GetUserById(Convert.ToInt32( polUnitPrice.Createdby));
                  if (polUnitPrice.POLUnitPriceId>0)
                {
                    PolUnitPricesService _polUnitPriceService = new PolUnitPricesService(_user);
                    message = _polUnitPriceService.UpdatePolUnitPrice(polUnitPrice);
                }
                else
                {
                    PolUnitPricesService _polUnitPriceService = new PolUnitPricesService(_user);
                    polUnitPrice.CompanyId = Convert.ToInt32( _user.CompanyId);
                    message = _polUnitPriceService.InsertPolUnitPrice(polUnitPrice);
                }
                return Request.CreateResponse(HttpStatusCode.OK, message);
            }catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, _user.Language == "bn" ? "সিস্টেম তথ্য দেখাতে ব্যর্থ হয়েছে। আপনি আবার চেষ্টা করুন।" : "System has failed to show POL prices list. Please contact with admin.");
            }
        }
    }
}
