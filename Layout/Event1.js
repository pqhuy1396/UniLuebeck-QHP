import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

const Event1 = () => {
  const [termine, setTermine] = useState(null);

  useEffect(() => {
    fetchTermine();
  }, []);

  const fetchTermine = async () => {
    try {
      const response = await fetch('https://www.wasgehtapp.de/location.php?id=20437', {
        method: 'POST',
        headers: {
          'User-Agent': 'Wasgehtapp-Example-Importer',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Bearer <YOUR_AUTH_TOKEN>',
        },
        body: 'locations[]=7&columns[]=beschreibung',
      });
  
      const data = await response.json();
  
      // Process the data
    } catch (error) {
      console.log('Error fetching termine:', error);
    }
  };

  if (termine && termine.error) {
    return <Text>{termine.error}</Text>;
  }

  if (!termine || termine.data.length === 0) {
    return <Text>Keine Termine gefunden!</Text>;
  }

  return (
    <View>
      {termine.data.map((termin) => (
        <React.Fragment key={termin.id}>
          <Text>
            {strftime('%d.%m.%Y, %H:%M Uhr', strtotime(`${termin.datum} ${termin.zeit}`))}
          </Text>
          <Text>{termin.titel}</Text>
          <Text>{termin.beschreibung}</Text>
          <View style={{ borderBottomWidth: 1, borderBottomColor: 'gray' }} />
        </React.Fragment>
      ))}
    </View>
  );
};

export default Event1;
