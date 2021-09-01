import 'tailwindcss/tailwind.css'
import Head from 'next/head'

function Bags({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <style jsx global>
        {`
          body {
            background: #000000e0;
            color: white;
            overflow-x: hidden;
          }
          input {
            color: black;
          }
          .autocomplete{
            position: absolute;
            background: grey;
            color: black;
            margin-left: 128px;
            height: 200px;
            overflow: auto;
          }
        `}
      </style>
      <Head>
        <title>floorbags.market</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inconsolata:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@breterb" />
        <meta property="og:url" content="https://floorbags.market" />
        <meta property="og:title" content="floorbags.market" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <meta
          property="og:description"
          content="See the floor price of Divine Robes from the Loot project."
        />
        <meta property="og:image" content="https://robes.market/og.png" />
        <script
          data-goatcounter="https://divinerobes.goatcounter.com/count"
          async
          src="//gc.zgo.at/count.js"
        ></script>
      </Head>
    </>
  )
}

export default Bags
