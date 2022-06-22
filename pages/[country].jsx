import styles from '../styles/Country.module.css'
import Image from 'next/image'
import { useRouter } from 'next/router'

const country = ({ data }) => {
  const router = useRouter()

  return (
    <>
      <div className={styles.btn_back}>
        <button onClick={() => router.push('/')}>Back to overview</button>
      </div>
      {data.map((item, index) => (
        <div key={index} className={styles.container}>
          <div className={styles.image}>
            <img src={item.flags.svg} alt={item.name.common} />
          </div>
          <div className={styles.content}>
            <h1>{item.name.common}</h1>
            <ul className={styles.list}>
              <li>
                <strong>Population: </strong>
                {item.population.toLocaleString() ?? '-'}
              </li>
              <li>
                <strong>Top Level Domain: </strong>
                {item.tld.map((item) => (item ? item : '-')).join(', ')}
              </li>
              <li>
                <strong>Region: </strong>
                {item.region ?? '-'}
              </li>
              <li>
                <strong>Subregion: </strong>
                {item.subregion ?? '-'}
              </li>
              <li>
                <strong>Capital: </strong>
                {item.capital ?? '-'}
              </li>
              <li>
                <strong>Currencies: </strong>
                {item.currencies
                  ? Object.keys(item.currencies)
                      .map((value) => item.currencies[value].name)
                      .join(', ')
                  : '-'}
              </li>
              <li>
                <strong>Languages: </strong>
                {item.languages
                  ? Object.keys(item.languages)
                      .map((lang) => item.languages[lang])
                      .join(', ')
                  : '-'}
              </li>
            </ul>
          </div>
        </div>
      ))}
    </>
  )
}

export default country

// This function gets called at build time
export async function getStaticPaths() {
  // Call an external API endpoint to get countries
  const res = await fetch(`https://restcountries.com/v3.1/all`)
  const countries = await res.json()

  // Get the paths we want to pre-render based on country
  const paths = countries.map((country) => ({
    params: { country: country.name.common.toLowerCase() },
  }))

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
}

// This also gets called at build time
export async function getStaticProps({ params }) {
  // params contains the country `name`.
  const res = await fetch(
    `https://restcountries.com/v3.1/name/${params.country}`,
  )
  const data = await res.json()

  // Pass post data to the page via props
  return { props: { data } }
}
