// pages/api/export-to-csv.js
import { Parser } from 'json2csv';
import { getTourExportByCodename } from '../../lib/services/kontentClient';
import { defaultEnvId, defaultPreviewKey } from '../../lib/utils/env';
import { ExportModule, Tour } from '../../models';

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
  const toursExport = await getTourExportByCodename({ envId: currentEnvId, previewApiKey: currentPreviewApiKey }, tourCodename, true) as ExportModule;

  const contentItems = []
  toursExport.elements.toursToExport.linkedItems.map((tour) => {
    contentItems.push(fetchContentItems(tour))
  }
  )

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
    },   
    {
      label: 'BPM Includes',
      value: 'bpmincludes'
    }
  ];

  try {
    // Create a new parser instance with the fields
    const parser = new Parser({ fields });
    // Convert data to CSV
    const csv = parser.parse(contentItems);

    // Set the headers to prompt download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${getCurrentDate()}-${tourCodename}.csv`);

    // Send the CSV file
    res.status(200).send(csv);
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Failed to generate multiple-tours CSV file' });
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
  // const startMonth = formatMonthsForLocale(tour.elements.startDate?.value, tour.system.language, 'short')
  // const endMonth = formatMonthsForLocale(tour.elements.endDate?.value, tour.system.language, 'short')
  return {
    tourName: tour.elements.tourTitle?.value,
    description: tour.elements.tourIntro?.value,
    includes: tour.elements.whatsIncluded?.value,
    duration: tour.elements.tourDurationInDays?.value,
    // months: `${startMonth} - ${endMonth}`,
    images: tour.elements.images?.value.map((image) => image.url).join(';'),
    hotelname: tour.elements.hotelS.linkedItems.map((hotel) => hotel.elements.name?.value).join('|'),
    hoteldescription: tour.elements.hotelS.linkedItems.map((hotel) => hotel.elements.description?.value).join('|'),
    hotelaccessibility: tour.elements.hotelS.linkedItems.map((hotel) => hotel.elements.accessibilityInformation?.value).join('|'), 
    hotelrating: tour.elements.hotelS.linkedItems.map((hotel) => hotel.elements.rating?.value).join('|'), 
    
    //includedexcursion: tour.elements.includedExcursions.linkedItems[0]?.elements.destination?.value,
    includedexcursion: tour.elements.includedExcursions.linkedItems.map((incexcursion) => incexcursion.elements.destination?.value).join('|'),
    //includedexcursiondescription: tour.elements.includedExcursions.linkedItems[0]?.elements.description?.value,
    includedexcursiondescription: tour.elements.includedExcursions.linkedItems.map((incexcursion) => incexcursion.elements.description?.value).join('|'),
    
    optionalexcursion: tour.elements.optionalExcursionS.linkedItems.map((optexcursion) => `${optexcursion.elements.destination?.value} (${optexcursion.elements.durationHalfDayFullDay?.value})`).join('|'), 
    
    //optionalexcursiondescription: tour.elements.optionalExcursionS.linkedItems[0]?.elements.description?.value,
    optionalexcursiondescription: tour.elements.optionalExcursionS.linkedItems.map((optexcurs) => optexcurs.elements.description?.value).join('|'),
    //optionalexcursionprice: tour.elements.optionalExcursionS.linkedItems[0]?.elements.priceInPp?.value,
    optionalexcursionprice: tour.elements.optionalExcursionS.linkedItems.map((optexcurs) => optexcurs.elements.priceInPp?.value).join('|'),
    
    tourtype: tour.elements.tourType?.value[0].name,
    readeroffertwo: tour.elements.readerOfferIntro2?.value,
    readerofferthree: tour.elements.readerOfferIntro3?.value,
    bpmincludes: tour.elements.bpmIncludes?.value
  }
}
