import Navbar from '../components/NavBar';
import SOSHeader from '../components/sos/SOSHeader';
import EmergencyCard from '../components/sos/EmergencyCard';
import ActionButtons from '../components/sos/ActionButtons';
import LocationShare from '../components/sos/LocationShare';
import ContactList from '../components/sos/ContactList';
import CountdownAlert from '../components/sos/CountdownAlert';

function SOS() {
  return (
    <div>
      <Navbar />
      <SOSHeader />
      <EmergencyCard />
      <ActionButtons />
      <LocationShare />
      <ContactList />
      <CountdownAlert />
    </div>
  )
}

export default SOS;
