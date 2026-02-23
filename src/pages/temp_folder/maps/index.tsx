import React, { useState, useEffect, useRef } from 'react';
import {
    MapPin,
    Navigation,
    Info,
} from 'lucide-react';

import { OutletType } from '@/types/Outlet';
import LayoutStore from '@/Components/Layout/LayoutStore';
import { StoreData, storeService } from '@/services/storeService';

// MASUKKAN API KEY ANDA DI SINI
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const MapsPage = () => {
    const [outlets, setOutlets] = useState<OutletType[]>([]);
    const [infoStore, setInfoStore] = useState<StoreData | null>(null);

    // Komponen Peta menggunakan Google Maps
    const GoogleMapView = () => {
        const mapRef = useRef(null);

        useEffect(() => {
            const loadGoogleMaps = () => {
                if (window.google) {
                    initMap();
                    return;
                }

                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initGoogleMap`;
                script.async = true;
                script.defer = true;
                window.initGoogleMap = initMap;
                document.head.appendChild(script);
            };

            const initMap = () => {
                const map = new window.google.maps.Map(mapRef.current, {
                    center: { lat: -3.319, lng: 114.591 },
                    zoom: 12,
                    styles: [
                        {
                            "featureType": "all",
                            "elementType": "geometry.fill",
                            "stylers": [{ "weight": "2.00" }]
                        },
                        {
                            "featureType": "poi.business",
                            "elementType": "all",
                            "stylers": [{ "visibility": "off" }]
                        }
                    ],
                    disableDefaultUI: true,
                    zoomControl: true,
                });

                const infoWindow = new window.google.maps.InfoWindow();

                outlets.forEach(outlet => {
                    const marker = new window.google.maps.Marker({
                        position: outlet.coords,
                        map: map,
                        title: outlet.name,
                        icon: {
                            path: window.google.maps.SymbolPath.CIRCLE,
                            fillColor: infoStore?.branding?.primary_color || "#1A2D5E",
                            fillOpacity: 1,
                            strokeWeight: 2,
                            strokeColor: "#ffffff",
                            scale: 15,
                        },
                        label: {
                            text: "CH",
                            color: "white",
                            fontSize: "10px",
                            fontWeight: "bold"
                        }
                    });

                    marker.addListener("click", () => {
                        infoWindow.setContent(`
              <div style="padding: 8px; font-family: sans-serif; min-width: 150px;">
                <h4 style="margin: 0 0 4px 0; color: ${infoStore?.branding?.primary_color || "#1A2D5E"}; font-size: 14px;">${outlet.name}</h4>
                <p style="margin: 0 0 8px 0; font-size: 11px; color: #666;">${outlet.address}</p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 10px; font-weight: bold; color: ${outlet.status === 'Buka' ? '#059669' : '#e11d48'}">${outlet.status}</span>
                  <a href="https://www.google.com/maps/dir/?api=1&destination=${outlet.coords.lat},${outlet.coords.lng}" target="_blank" style="text-decoration: none; color: ${infoStore?.branding?.primary_color || "#1A2D5E"}; font-size: 10px; font-weight: bold; border: 1px solid ${infoStore?.branding?.primary_color || "#1A2D5E"}; padding: 2px 6px; border-radius: 4px;">Rute</a>
                </div>
              </div>
            `);
                        infoWindow.open(map, marker);
                    });
                });
            };

            loadGoogleMaps();
        }, []);

        return (
            <div className="relative w-full h-[calc(100vh-250px)] rounded-3xl overflow-hidden shadow-xl border-4 border-white">
                <div ref={mapRef} className="w-full h-full bg-slate-100" />
            </div>
        );
    };

    // const getClient = async () => {
    //     try {
    //         const result = await storeService.getStoreInfo();
    //         if (result.status === 'success') {
    //             console.log('result', result?.data?.outlets)
    //             const outlets: OutletType[] = result?.data?.outlets?.map((item: any) => ({
    //                 id: item.id,
    //                 name: item.name,
    //                 address: item.address,
    //                 distance: item.distance ?? null, // default dulu kalau tidak ada
    //                 status: item.is_open ? 'Buka' : 'Tutup',
    //                 closeTime: item.open_until,
    //                 phone: item.telp,
    //                 coords: {
    //                     lat: Number(item.latitude),
    //                     lng: Number(item.longitude),
    //                 }
    //             })) ?? [];

    //             setOutlets(outlets);
    //         }
    //     } catch (error) {
    //         console.error("Gagal memuat:", error);
    //     } finally {
    //     }
    // };


    return (
        <LayoutStore
            setOutlets={setOutlets}
            setInfoStore={setInfoStore}>
            <div className="space-y-6 animate-in fade-in duration-700">
                <div className="flex justify-between items-end">
                    <div>
                        <h3 className="font-extrabold text-xl text-slate-800 tracking-tight">Eksplorasi Peta</h3>
                        <p className="text-[11px] text-slate-500 font-medium">Temukan outlet Pondok Cokelat Hatta terdekat</p>
                    </div>
                    <div className="bg-[var(--primary-color)]/5 p-2 rounded-xl text-[var(--primary-color)]">
                        <Navigation size={20} />
                    </div>
                </div>

                {GOOGLE_MAPS_API_KEY ? (
                    <GoogleMapView />
                ) : (
                    <div className="h-[300px] w-full bg-[var(--primary-color)] rounded-3xl border-2 border-dashed border-[var(--primary-color)] flex flex-col items-center justify-center p-8 text-center">
                        <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                            <MapPin size={32} className="text-[var(--primary-color)]" />
                        </div>
                        <h4 className="text-[var(--primary-color)] font-bold mb-2">API Key Diperlukan</h4>
                        <p className="text-[var(--primary-color)]/60 text-[11px] leading-relaxed">Mohon masukkan Google Maps API Key Anda ke dalam variabel <code className="bg-blue-100 px-1 rounded">GOOGLE_MAPS_API_KEY</code> di bagian atas kode.</p>
                    </div>
                )}
                <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-[var(--primary-color)] text-white rounded-lg">
                            <Info size={16} />
                        </div>
                        <span className="font-bold text-sm text-slate-800">Petunjuk Peta</span>
                    </div>
                    <ul className="space-y-3">
                        <li className="flex gap-3 text-[11px] text-slate-600">
                            <div className="w-4 h-4 rounded-full bg-[var(--primary-color)] flex-shrink-0" />
                            <span>Klik ikon penanda untuk melihat detail singkat outlet.</span>
                        </li>
                        <li className="flex gap-3 text-[11px] text-slate-600">
                            <div className="w-4 h-4 rounded-full border-2 border-[var(--primary-color)] flex-shrink-0" />
                            <span>Gunakan tombol "Rute" di jendela info untuk navigasi GPS.</span>
                        </li>
                    </ul>
                </div>
            </div>
        </LayoutStore>
    );
};

export default MapsPage;