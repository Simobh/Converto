
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-travel',
  templateUrl: './travel.component.html',
  styleUrls: ['./travel.component.css']
})
export class TravelComponent implements OnInit {
  isAuthenticated = false;
  destinations: any[] = [];

  constructor(
    private authService: AuthService,
    private fireStoreService: FirestoreService,
    private router: Router
  ) {
    this.authService.user$.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  ngOnInit() {
    this.loadDestinations();
  }

  loadDestinations() {
    this.fireStoreService.getUserTravale().subscribe(destinations => {
      this.destinations = destinations;
    });
  }

  getCountryCode(countryName: string): string {
    const countryMap: { [key: string]: string } = {
      'afghanistan': 'af',
      'albania': 'al',
      'algeria': 'dz',
      'andorra': 'ad',
      'angola': 'ao',
      'antigua and barbuda': 'ag',
      'argentina': 'ar',
      'armenia': 'am',
      'australia': 'au',
      'austria': 'at',
      'azerbaijan': 'az',
      'bahamas': 'bs',
      'bahrain': 'bh',
      'bangladesh': 'bd',
      'barbados': 'bb',
      'belarus': 'by',
      'belgium': 'be',
      'belize': 'bz',
      'benin': 'bj',
      'bhutan': 'bt',
      'bolivia': 'bo',
      'bosnia and herzegovina': 'ba',
      'botswana': 'bw',
      'brazil': 'br',
      'brunei': 'bn',
      'bulgaria': 'bg',
      'burkina faso': 'bf',
      'burundi': 'bi',
      'cabo verde': 'cv',
      'cambodia': 'kh',
      'cameroon': 'cm',
      'canada': 'ca',
      'central african republic': 'cf',
      'chile': 'cl',
      'china': 'cn',
      'colombia': 'co',
      'comoros': 'km',
      'congo': 'cg',
      'costa rica': 'cr',
      'croatia': 'hr',
      'cuba': 'cu',
      'cyprus': 'cy',
      'czech republic': 'cz',
      'denmark': 'dk',
      'djibouti': 'dj',
      'dominica': 'dm',
      'dominican republic': 'do',
      'ecuador': 'ec',
      'egypt': 'eg',
      'el salvador': 'sv',
      'equatorial guinea': 'gq',
      'eritrea': 'er',
      'estonia': 'ee',
      'eswatini': 'sz',
      'ethiopia': 'et',
      'fiji': 'fj',
      'finland': 'fi',
      'france': 'fr',
      'gabon': 'ga',
      'gambia': 'gm',
      'georgia': 'ge',
      'germany': 'de',
      'ghana': 'gh',
      'greece': 'gr',
      'grenada': 'gd',
      'guatemala': 'gt',
      'guinea': 'gn',
      'guinea-bissau': 'gw',
      'guyana': 'gy',
      'haiti': 'ht',
      'honduras': 'hn',
      'hungary': 'hu',
      'iceland': 'is',
      'india': 'in',
      'indonesia': 'id',
      'iran': 'ir',
      'iraq': 'iq',
      'ireland': 'ie',
      'israel': 'il',
      'italy': 'it',
      'jamaica': 'jm',
      'japan': 'jp',
      'jordan': 'jo',
      'kazakhstan': 'kz',
      'kenya': 'ke',
      'kiribati': 'ki',
      'korea, north': 'kp',
      'korea, south': 'kr',
      'kosovo': 'xk',
      'kuwait': 'kw',
      'kyrgyzstan': 'kg',
      'laos': 'la',
      'latvia': 'lv',
      'lebanon': 'lb',
      'lesotho': 'ls',
      'liberia': 'lr',
      'libya': 'ly',
      'liechtenstein': 'li',
      'lithuania': 'lt',
      'luxembourg': 'lu',
      'madagascar': 'mg',
      'malawi': 'mw',
      'malaysia': 'my',
      'maldives': 'mv',
      'mali': 'ml',
      'malta': 'mt',
      'marshall islands': 'mh',
      'mauritania': 'mr',
      'mauritius': 'mu',
      'mexico': 'mx',
      'micronesia': 'fm',
      'moldova': 'md',
      'monaco': 'mc',
      'mongolia': 'mn',
      'montenegro': 'me',
      'morocco': 'ma',
      'mozambique': 'mz',
      'myanmar': 'mm',
      'namibia': 'na',
      'nauru': 'nr',
      'nepal': 'np',
      'netherlands': 'nl',
      'new zealand': 'nz',
      'nicaragua': 'ni',
      'niger': 'ne',
      'nigeria': 'ng',
      'north macedonia': 'mk',
      'norway': 'no',
      'oman': 'om',
      'pakistan': 'pk',
      'palau': 'pw',
      'panama': 'pa',
      'papua new guinea': 'pg',
      'paraguay': 'py',
      'peru': 'pe',
      'philippines': 'ph',
      'poland': 'pl',
      'portugal': 'pt',
      'qatar': 'qa',
      'romania': 'ro',
      'russia': 'ru',
      'rwanda': 'rw',
      'saint kitts and nevis': 'kn',
      'saint lucia': 'lc',
      'saint vincent and the grenadines': 'vc',
      'samoa': 'ws',
      'san marino': 'sm',
      'sao tome and principe': 'st',
      'saudi arabia': 'sa',
      'senegal': 'sn',
      'serbia': 'rs',
      'seychelles': 'sc',
      'sierra leone': 'sl',
      'singapore': 'sg',
      'slovakia': 'sk',
      'slovenia': 'si',
      'solomon islands': 'sb',
      'somalia': 'so',
      'south africa': 'za',
      'south sudan': 'ss',
      'spain': 'es',
      'sri lanka': 'lk',
      'sudan': 'sd',
      'suriname': 'sr',
      'sweden': 'se',
      'switzerland': 'ch',
      'syria': 'sy',
      'taiwan': 'tw',
      'tajikistan': 'tj',
      'tanzania': 'tz',
      'thailand': 'th',
      'timor-leste': 'tl',
      'togo': 'tg',
      'tonga': 'to',
      'trinidad and tobago': 'tt',
      'tunisia': 'tn',
      'turkey': 'tr',
      'turkmenistan': 'tm',
      'tuvalu': 'tv',
      'uganda': 'ug',
      'ukraine': 'ua',
      'united arab emirates': 'ae',
      'united kingdom': 'gb',
      'united states': 'us',
      'uruguay': 'uy',
      'uzbekistan': 'uz',
      'vanuatu': 'vu',
      'vatican city': 'va',
      'venezuela': 've',
      'vietnam': 'vn',
      'yemen': 'ye',
      'zambia': 'zm',
      'zimbabwe': 'zw'
    };
    return countryMap[countryName.toLowerCase()] || countryName.toLowerCase().slice(0, 2);
  }

  navigateToBudget(destination?: any) {
    if (destination) {
      this.router.navigate(['/budget'], {
        queryParams: {
          currency: destination.currency,
          destination: destination.destination,
          departureDate: destination.departureDate,
          returnDate: destination.returnDate,
          budget: destination.budget,
          expenses: JSON.stringify(destination.expenses)
        }
      });
    } else {
      this.router.navigate(['/budget']);
    }
  }

  logout() {
    this.authService.logout();
  }
}
