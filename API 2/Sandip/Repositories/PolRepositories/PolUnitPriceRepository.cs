using Sandip.DAL;
using System;
using System.Collections.Generic;
using System.Data.Entity.Migrations;
using System.Linq;
using System.Web;

namespace Sandip.Repositories.PolRepositories
{
    public class PolUnitPriceRepository
    {
        private CarSystemEntities _contex;
        private User _user;
       public PolUnitPriceRepository(CarSystemEntities contex, User user) {
            _contex = contex;
            _user = user;
        }

        public IEnumerable<POLUnitPrice> GetPolUnitPrices() {
            return _contex.POLUnitPrices.Where(x=>x.CompanyId== _user.CompanyId).ToList();
        }

        public POLUnitPrice GetPolUnitPriceById(int polUnitPriceId)
        {
            return _contex.POLUnitPrices.Where(x => x.POLUnitPriceId == polUnitPriceId).FirstOrDefault();
        }

        public int InsertPolUnitPrice(POLUnitPrice polUnitPrice)
        {
             _contex.POLUnitPrices.Add(polUnitPrice);
            _contex.SaveChanges();
            return polUnitPrice.POLUnitPriceId;
        }

        public int UpdatePolUnitPrice(POLUnitPrice polUnitPrice)
        {
            _contex.POLUnitPrices.AddOrUpdate(polUnitPrice);
            _contex.SaveChanges();
            return 1;
        }

        public int DaletePolUnitPrice(int polUnitPriceId)
        {
            var itemToRemove = _contex.POLUnitPrices.SingleOrDefault(x => x.POLUnitPriceId == polUnitPriceId); //returns a single item.
            var returnVal= -1;
            if (itemToRemove != null)
            {
                _contex.POLUnitPrices.Remove(itemToRemove);
                itemToRemove = _contex.POLUnitPrices.SingleOrDefault(x => x.POLUnitPriceId == polUnitPriceId); //returns a single item.
                returnVal= _contex.SaveChanges();
            }

            return returnVal;
        }
    }
}