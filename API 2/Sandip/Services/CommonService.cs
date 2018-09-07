using Sandip.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Sandip.Services
{
    public class CommonService
    {
        private CarSystemEntities _contex;
        public CommonService()
        {
            _contex = new CarSystemEntities();
        }

        public User GetUserById(int userId) {
           return _contex.Users.Where(x=>x.Id==userId).FirstOrDefault();
        }
    }
}