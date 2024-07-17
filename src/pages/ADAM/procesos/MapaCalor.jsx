const MapaCalor = ({ points }) => {
    const map = useMap();
  
    useEffect(() => {
      const heat = L.heatLayer(points, { radius: 25 }).addTo(map);
      return () => {
        map.removeLayer(heat);
      };
    }, [map, points]);
  
    return null;
  };
  