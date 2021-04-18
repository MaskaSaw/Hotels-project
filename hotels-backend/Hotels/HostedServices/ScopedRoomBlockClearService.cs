using Hotels.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Hotels.HostedServices
{
    public class ScopedRoomBlockClearService: IScopedProcessingService
    {
        private readonly HotelsDBContext _context;

        public ScopedRoomBlockClearService(HotelsDBContext context)
        {
            _context = context;
        }

        public async Task DoWork(CancellationToken stopToken)
        {
            while (!stopToken.IsCancellationRequested)
            {
                _context.RoomBlocks
                    .RemoveRange(_context.RoomBlocks
                        .Where(block => block.End < DateTime.UtcNow)
                        .ToList()
                    );

                _context.SaveChanges();

                await Task.Delay(1000*60*30, stopToken);
            }
               
        }

    }
    internal interface IScopedProcessingService
    {
        Task DoWork(CancellationToken stoppingToken);
    }
}
