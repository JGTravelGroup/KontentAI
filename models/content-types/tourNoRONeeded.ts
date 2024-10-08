import { type IContentItem, type Elements } from '@kontent-ai/delivery-sdk';
import { type Excursion } from './excursion';
import { type Hotel } from './hotel';
import { type TourType } from '../taxonomies/tourType';

/**
 * Generated by '@kontent-ai/model-generator@6.5.1'
 *
 * Tour (No RO Needed)
 * Id: b351ceee-fdea-450a-99a5-dd4b53732c4f
 * Codename: tour__copy_
 */
export type TourNoRONeeded = IContentItem<{
    /**
     * Export Tour (custom)
     * Required: false
     * Id: 8aa22cd0-bec0-4674-9d7f-83826d9fe4d8
     * Codename: export_tour
     */
    exportTour: Elements.CustomElement;

    /**
     * Hotel(s) (modular_content)
     * Required: false
     * Id: e23120c8-9310-4bfd-8f10-bcdbe3013d6e
     * Codename: hotel_s_
     */
    hotelS: Elements.LinkedItemsElement<Hotel>;

    /**
     * Images (asset)
     * Required: false
     * Id: 228a663c-e4c0-45a1-bf49-4338c3cdda40
     * Codename: images
     */
    images: Elements.AssetsElement;

    /**
     * Included Excursions (modular_content)
     * Required: false
     * Id: d5c75130-a886-44f9-950b-dff2c23ad2ff
     * Codename: included_excursions
     */
    includedExcursions: Elements.LinkedItemsElement<Excursion>;

    /**
     * Optional Excursion(s) (modular_content)
     * Required: false
     * Id: 4c43fc0d-3a5e-4d82-8115-bb298a65c9c9
     * Codename: optional_excursion_s_
     */
    optionalExcursionS: Elements.LinkedItemsElement<Excursion>;

    /**
     * Reader offer intro 2 (rich_text)
     * Required: false
     * Id: 33f86b39-82d2-460d-bbd4-4f53f400381d
     * Codename: reader_offer_intro_2
     */
    readerOfferIntro2: Elements.RichTextElement;

    /**
     * Reader offer intro 3 (rich_text)
     * Required: false
     * Id: 9c28938d-bdfa-4daa-b45f-b961b30516a5
     * Codename: reader_offer_intro_3
     */
    readerOfferIntro3: Elements.RichTextElement;

    /**
     * Tour duration in days (number)
     * Required: true
     * Id: 3daa20b1-7384-4b4e-9198-d5b78063bc23
     * Codename: tour_duration_in_days
     */
    tourDurationInDays: Elements.NumberElement;

    /**
     * Tour Intro (rich_text)
     * Required: true
     * Id: 889a6a81-7f1d-4780-82d5-7f435d97fd85
     * Codename: tour_intro
     */
    tourIntro: Elements.RichTextElement;

    /**
     * Tour Title (text)
     * Required: true
     * Id: bf99fa38-7936-4173-8484-a776575f446e
     * Codename: tour_title
     */
    tourTitle: Elements.TextElement;

    /**
     * Tour Type (taxonomy)
     * Required: true
     * Id: c9fe632c-bfdb-4471-8d02-d14c1f26432d
     * Codename: tour_type
     */
    tourType: Elements.TaxonomyElement<TourType>;

    /**
     * What's Included (rich_text)
     * Required: true
     * Id: 2602cf3f-b91b-4380-84ab-196e8ba8de6d
     * Codename: untitled_rich_text
     */
    untitledRichText: Elements.RichTextElement;
}>;
