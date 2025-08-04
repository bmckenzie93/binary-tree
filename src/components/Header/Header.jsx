import logo from '../../assets/mrh-logo.webp'

const Header = ({ onSelectDataset }) => {
    const handleChange = (e) => {
    onSelectDataset(e.target.value);
  };

  return (
    <header>
      <img src={logo} alt="Mountain Rose Herbs Logo" />
      <div className="legend">
        <p>Welcome to Mountain Rose Herbs: Herbalism Family Tree!</p>
        <p>Click, drag, pinch and scroll to explore around the app. Click on a card to open and close it's descendants.</p>
        <p>
          Select which tree you would like to explore here: <select name="dataSelect" id="dataSelect" onChange={handleChange}>
                                                              <option value="one">Data set one</option>
                                                              <option value="two">Data set two</option>
                                                              <option value="three">Data set three</option>
                                                            </select>
        </p>
        

        <div className="badge-key">
          <ul>
            <li><span className="badge badge--orange"></span> Founder</li>
            <li><span className="badge badge--green"></span> Lineage Holder</li>
            <li><span className="badge badge--blue"></span> Contemporary Herbalist</li>
          </ul>
        </div>
      </div> 
    </header>
  )
}

export default Header