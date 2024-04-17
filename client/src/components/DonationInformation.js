import React from "react";


export const DonationInformation = ({ totalDonations, myDonationAmount }) => {
    return (
        <div className="User-information">
            <h2 id="inline">Donation information</h2>
                {/* Donation information */}
            <div className="User-information-text">
                {/* Basic Information */}
                <p><b>Donations:</b> {totalDonations/ 1000000000000000000}</p>
                <p><b>My Donations:</b> {myDonationAmount/ 1000000000000000000}</p>
            </div>
        </div>
    );
};