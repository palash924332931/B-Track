using Sandip.DAL;
using Sandip.Repositories.PolRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Sandip.Services.Admin
{
    public class PolUnitPricesService
    {
        private readonly CarSystemEntities _contex;
        private readonly PolUnitPriceRepository _polUnitPriceRepo;
        public User _user;

        public PolUnitPricesService(User user)
        {
            _user = user;
            _contex = new CarSystemEntities();
            _polUnitPriceRepo = new PolUnitPriceRepository(_contex, _user);

        }


        public IEnumerable<POLUnitPrice> GetPolUnitPrices()
        {
            return _polUnitPriceRepo.GetPolUnitPrices();
        }

        public POLUnitPrice GetPolUnitPriceById(int polCostId)
        {
            return _polUnitPriceRepo.GetPolUnitPriceById(polCostId);
        }

        public int InsertPolUnitPrice(POLUnitPrice polUnitPrice)
        {           
            return _polUnitPriceRepo.InsertPolUnitPrice(polUnitPrice);
        }

        public int UpdatePolUnitPrice(POLUnitPrice polUnitPrice)
        {
            return _polUnitPriceRepo.UpdatePolUnitPrice(polUnitPrice);
        }

        public int DaletePolUnitPrice(int polUnitPriceId)
        {

            return _polUnitPriceRepo.DaletePolUnitPrice(polUnitPriceId);
        }

    }
}