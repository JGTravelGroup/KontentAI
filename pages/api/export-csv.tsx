// pages/api/export-to-csv.js
import { Parser } from 'json2csv';
import { getTourByCodename } from '../../lib/services/kontentClient';
import { defaultEnvId, defaultPreviewKey } from '../../lib/utils/env';
import { Tour } from '../../models';
import { formatDate, formatMonthsForLocale } from '../../lib/utils/dateTime';

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
  const contentItems = await fetchContentItems(tour);

  // Define the fields for the CSV file
  const fields = [
    {
      label: 'Tour Name',
      value: 'tourName'
    },
    {
      label: 'Description',
      value: 'description'
    }, 
    {
      label: 'Includes',
      value: 'includes'
    },
    {
      label: 'Images',
      value: 'images'
    },
    {
      label: 'Days',
      value: 'duration'
    },    
    {
      label: 'Hotel name',
      value: 'hotelname'
    },
    {
      label: 'Hotel description',
      value: 'hoteldescription'
    },
    {
      label: 'Hotel accessibility information',
      value: 'hotelaccessibility'
    },
    {
      label: 'Hotel rating',
      value: 'hotelrating'
    },    
    {
      label: 'Included Excursion',
      value: 'includedexcursion'
    }, 
    {
      label: 'Included excursion description',
      value: 'includedexcursiondescription'
    },    
    {
      label: 'Optional excursion',
      value: 'optionalexcursion'
    }, 
    {
      label: 'Optional excursion description',
      value: 'optionalexcursiondescription'
    }, 
    {
      label: 'Optional excursion price',
      value: 'optionalexcursionprice'
    },  
    {
      label: 'Tour Type',
      value: 'tourtype'
    },    
    {
      label: 'Reader Offer Intro 2',
      value: 'readeroffertwo'
    },   
    {
      label: 'Reader Offer Intro 3',
      value: 'readerofferthree'
    }
  ];

  try {
    // Create a new parser instance with the fields
    const parser = new Parser({ fields });
    // Convert data to CSV
    const csv = parser.parse(contentItems);

    // Set the headers to prompt download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${tour.elements.name?.value}.csv`);

    // Send the CSV file
    res.status(200).send(csv);
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Failed to generate single-tour CSV file' });
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
async function fetchContentItems(tour: Tour) {  
  return {
    tourName: tour.elements.tourTitle?.value,
    description: tour.elements.tourIntro?.value,
    includes: tour.elements.untitledRichText?.value,
    duration: tour.elements.tourDurationInDays?.value,
    images: tour.elements.images?.value.map((image) => image.url).join(';'),
    hotelname: tour.elements.hotelS.linkedItems[0]?.elements.name?.value,
    hoteldescription: tour.elements.hotelS.linkedItems[0]?.elements.description?.value,
    hotelaccessibility: tour.elements.hotelS.linkedItems[0]?.elements.accessibilityInformation?.value,
    hotelrating: tour.elements.hotelS.linkedItems[0]?.elements.rating?.value,
    includedexcursion: tour.elements.includedExcursions.linkedItems[0]?.elements.destination?.value,
    includedexcursiondescription: tour.elements.includedExcursions.linkedItems[0]?.elements.description?.value,
    optionalexcursion: `${tour.elements.optionalExcursionS.linkedItems[0]?.elements.description?.value} (${tour.elements.optionalExcursionS.linkedItems[0]?.elements.durationHalfDayFullDay?.value})`,
    optionalexcursiondescription: tour.elements.optionalExcursionS.linkedItems[0]?.elements.description?.value,
    optionalexcursionprice: tour.elements.optionalExcursionS.linkedItems[0]?.elements.priceInPp?.value,
    tourtype: tour.elements.tourType?.value[0]?.name,
    readeroffertwo: tour.elements.readerOfferIntro2?.value,
    readerofferthree: tour.elements.readerOfferIntro3?.value
  }
}
