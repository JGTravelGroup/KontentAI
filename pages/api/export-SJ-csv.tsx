// pages/api/export-to-csv.js
import { Parser } from 'json2csv';
import { getTourByCodename } from '../../lib/services/kontentClient';
import { defaultEnvId, defaultPreviewKey } from '../../lib/utils/env';
import { Tour } from '../../models';

export default async function handler(req, res) {
  // Function to fetch content items and linked items from your CMS
  const tourCodename = req.query.codename;
  if (typeof tourCodename !== "string") {
    return res.status(400).json({ error: "You have to provide 'codename' query parameter with the tour's codename." });
  }
  const currentEnvId = defaultEnvId;
  const currentPreviewApiKey = defaultPreviewKey;
  // This should return an array of content items with linked items
  // For example:
  const tour = await getTourByCodename({ envId: currentEnvId, previewApiKey: currentPreviewApiKey }, tourCodename, true);
  
  //const contentItems = await fetchContentItems(tour);
  const contentItems = "";

  // Define the fields for the CSV file
  const fields = [
    {
      label: 'Tour Title',
      value: 'tourTitle'
    },
    {
      label: 'Tour Intro',
      value: 'tourIntro'
    }
  ];

  try {
    // Create a new parser instance with the fields
    const parser = new Parser({ fields });
    
    // Convert data to CSV
    const csv = parser.parse(contentItems); 
    
    // Set the headers to prompt download
    res.setHeader('Content-Type', 'text/csv');
    
    //res.setHeader('Content-Disposition', `attachment; filename=${tour.system.codename}.csv`);
    res.setHeader('Content-Disposition', `attachment; filename=joshtest.csv`);

    // Send the CSV file
    res.status(200).send(csv);
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Failed to generate single-tour SJ CSV file' });
  }
}


export function getCurrentDate(separator = '') {

  let newDate = new Date()
  let date = newDate.getDate();
  let month = newDate.getMonth() + 1;
  let year = newDate.getFullYear();

  return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${date}`
}

// Mock function to simulate fetching content items from a CMS
// Replace this with your actual data fetching logic
function fetchContentItems(tour: Tour) {  
  return {
    tourTitle: tour.elements.tourTitle?.value,
    tourIntro: tour.elements.tourIntro?.value
  }
}
