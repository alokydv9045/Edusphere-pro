'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  History, 
  Wrench, 
  Fuel, 
  ArrowLeft, 
  Loader2, 
  Search, 
  Calendar,
  IndianRupee,
  Bus
} from 'lucide-react';
import { transportAPI } from '@/lib/api/transport';
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';

export default function OperationalLogsPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<{maintenance: any[], fuel: any[]}>({ maintenance: [], fuel: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
        try {
          setIsLoading(true);
          const res = await transportAPI.getGlobalLogs();
          if (res.data?.success) setLogs(res.data.logs);
        } catch (err: any) {
          console.error('Logs fetch error:', err);
        } finally {
          setIsLoading(false);
        }
      };
    fetchLogs();
  }, []);

  const filteredMaintenance = logs.maintenance.filter(l => 
    l.vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.serviceType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFuel = logs.fuel.filter(l => 
    l.vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.stationName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
        <div className="flex flex-col items-center justify-center py-40 gap-6">
            <Loader2 className="h-12 w-12 animate-spin text-slate-900" />
            <p className="text-slate-900 text-sm font-black uppercase tracking-[0.2em] animate-pulse">Synchronizing Global Activity Ledger...</p>
        </div>
    );
}

  return (
    <div className="p-6 md:p-10 space-y-10 animate-in fade-in duration-700 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-start justify-between gap-6">
        <div>
           <h1 className="text-4xl font-black tracking-tight text-slate-900 flex items-center gap-4">
              <History className="h-10 w-10 text-slate-900" />
              Operational Ledger
           </h1>
           <p className="text-slate-500 font-medium mt-1">Centralized history of all maintenance events and fuel telemetry.</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                    placeholder="Search logs..." 
                    className="pl-10 h-14 rounded-2xl bg-white border-slate-200 focus-visible:ring-slate-900 shadow-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <Button variant="ghost" className="rounded-2xl h-14 w-14 p-0 hover:bg-slate-100" onClick={() => router.back()}>
               <ArrowLeft className="h-6 w-6" />
            </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
         <Card className="border-none shadow-xl bg-white rounded-[2.5rem] p-8 ring-1 ring-slate-100">
            <div className="flex items-center gap-5 mb-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                    <IndianRupee className="h-6 w-6" />
                </div>
                <div>
                    <CardTitle className="text-sm font-black text-slate-400 uppercase tracking-widest">Total Spend</CardTitle>
                    <p className="text-2xl font-black text-slate-900 mt-1">
                        ₹{(logs.maintenance.reduce((a, b) => a + b.cost, 0) + logs.fuel.reduce((a, b) => a + b.amount, 0)).toLocaleString()}
                    </p>
                </div>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                <div className="h-full bg-blue-500" style={{ width: '60%' }} />
                <div className="h-full bg-amber-400" style={{ width: '40%' }} />
            </div>
            <div className="flex items-center justify-between mt-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Maintenance vs Fuel</p>
                <p className="text-[10px] font-black text-slate-900">Live Period</p>
            </div>
         </Card>

         <Card className="border-none shadow-xl bg-white rounded-[2.5rem] p-8 ring-1 ring-slate-100">
            <div className="flex items-center gap-5 mb-4">
                <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center shadow-inner">
                    <Wrench className="h-6 w-6" />
                </div>
                <div>
                    <CardTitle className="text-sm font-black text-slate-400 uppercase tracking-widest">Service Events</CardTitle>
                    <p className="text-2xl font-black text-slate-900 mt-1">{logs.maintenance.length} Active Records</p>
                </div>
            </div>
            <p className="text-[10px] text-slate-400 font-medium leading-relaxed">Fleet maintenance cycles are prioritized based on safety protocols.</p>
         </Card>

         <Card className="border-none shadow-xl bg-white rounded-[2.5rem] p-8 ring-1 ring-slate-100">
            <div className="flex items-center gap-5 mb-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
                    <Fuel className="h-6 w-6" />
                </div>
                <div>
                    <CardTitle className="text-sm font-black text-slate-400 uppercase tracking-widest">Fuel Telemetry</CardTitle>
                    <p className="text-2xl font-black text-slate-900 mt-1">{logs.fuel.length} Logs Processed</p>
                </div>
            </div>
            <p className="text-[10px] text-slate-400 font-medium leading-relaxed">Average efficiency across active fleet is currently 88.5%.</p>
         </Card>
      </div>

      <Tabs defaultValue="maintenance" className="w-full space-y-8">
        <TabsList className="bg-slate-100/50 p-1.5 rounded-[1.5rem] h-16 w-full md:w-fit border border-slate-200">
          <TabsTrigger value="maintenance" className="h-12 px-10 rounded-2xl font-black text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-lg">
            Service Logs
          </TabsTrigger>
          <TabsTrigger value="fuel" className="h-12 px-10 rounded-2xl font-black text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-lg">
            Fuel Station
          </TabsTrigger>
        </TabsList>

        <TabsContent value="maintenance">
          <Card className="border shadow-xl rounded-[3rem] overflow-hidden bg-white ring-1 ring-slate-100">
            <div className="overflow-x-auto">
              <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="border-none hover:bg-transparent">
                  <TableHead className="h-16 pl-10 text-[10px] font-black uppercase text-slate-400 tracking-widest">ASSET IDENTITY</TableHead>
                  <TableHead className="h-16 text-[10px] font-black uppercase text-slate-400 tracking-widest">SERVICE TYPE</TableHead>
                  <TableHead className="h-16 text-[10px] font-black uppercase text-slate-400 tracking-widest">DATE & ODOMETER</TableHead>
                  <TableHead className="h-16 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right pr-10">TOTAL COST</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMaintenance.map((log) => (
                  <TableRow key={log.id} className="group hover:bg-slate-50/50 transition-colors">
                    <TableCell className="pl-10 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                          <Bus className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-base leading-none">{log.vehicle.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">{log.vehicle.registrationNumber}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-blue-50 text-blue-600 border-none font-black text-[10px] px-4 py-2 rounded-xl">
                        {log.serviceType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1.5">
                        <p className="text-sm font-black text-slate-900 flex items-center gap-2 tracking-tight">
                          <Calendar className="h-3 w-3 text-slate-300" />
                          {format(new Date(log.serviceDate), 'MMM dd, yyyy')}
                        </p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">km: {log.odometerReading.toLocaleString()}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-10">
                      <p className="text-lg font-black text-slate-900">₹{log.cost.toLocaleString()}</p>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="fuel">
          <Card className="border shadow-xl rounded-[3rem] overflow-hidden bg-white ring-1 ring-slate-100">
            <div className="overflow-x-auto">
              <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="border-none hover:bg-transparent">
                  <TableHead className="h-16 pl-10 text-[10px] font-black uppercase text-slate-400 tracking-widest">ASSET IDENTITY</TableHead>
                  <TableHead className="h-16 text-[10px] font-black uppercase text-slate-400 tracking-widest">FUELING STATION</TableHead>
                  <TableHead className="h-16 text-[10px] font-black uppercase text-slate-400 tracking-widest">QUANTITY</TableHead>
                  <TableHead className="h-16 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right pr-10">FILL COST</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFuel.map((log) => (
                  <TableRow key={log.id} className="group hover:bg-slate-50/50 transition-colors">
                    <TableCell className="pl-10 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-slate-100 text-slate-900 rounded-2xl flex items-center justify-center font-black group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                          <Bus className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-base leading-none">{log.vehicle.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">{log.vehicle.registrationNumber}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                       <p className="text-sm font-black text-slate-900 leading-none">{log.stationName || 'Network Hub'}</p>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">{format(new Date(log.date), 'MMM dd, HH:mm')}</p>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1.5">
                        <p className="text-sm font-black text-slate-900 flex items-center gap-2">
                           <Fuel className="h-3 w-3 text-emerald-500" />
                           {log.quantity} L
                        </p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">km: {log.odometerReading.toLocaleString()}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-10">
                      <p className="text-lg font-black text-slate-900">₹{log.amount.toLocaleString()}</p>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
