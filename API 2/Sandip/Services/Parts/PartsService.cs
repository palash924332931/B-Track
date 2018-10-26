using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Sandip.DAL;
using Sandip.Repositories.PartsCollectionRepository;
using Sandip.Repositories.PartsRepositories;

namespace Sandip.Services.Parts
{
    public class PartsService
    {
        private readonly CarSystemEntities _context;
        private readonly PartsDetailsRepository _partsRepository;
        private readonly StoreInfoRepository _storeInfoRepository;
        public User _user;

        public PartsService(User user)
        { 
            _user = user;
            _context = new CarSystemEntities();
            //_polUnitPriceRepo = new PolUnitPriceRepository(_contex, _user);

        }


        //public IEnumerable<POLUnitPrice> GetPolUnitPrices()
        //{
        //    return _polUnitPriceRepo.GetPolUnitPrices();
        //}

        //public POLUnitPrice GetPolUnitPriceById(int polCostId)
        //{
        //    return _polUnitPriceRepo.GetPolUnitPriceById(polCostId);
        //}

        //public int PostPolUnitPrice(POLUnitPrice polUnitPrice)
        //{
        //    return _polUnitPriceRepo.InsertPolUnitPrice(polUnitPrice);
        //}

        //public int UpdatePolUnitPrice(POLUnitPrice polUnitPrice)
        //{
        //    return _polUnitPriceRepo.UpdatePolUnitPrice(polUnitPrice);
        //}

        //public int DaletePolUnitPrice(int polUnitPriceId)
        //{

        //    return _polUnitPriceRepo.DaletePolUnitPrice(polUnitPriceId);
        //}
    }
}