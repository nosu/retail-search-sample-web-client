import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import theme from '../src/theme';
import createEmotionCache from '../src/createEmotionCache';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { Config } from '../types/common';

const clientSideEmotionCache = createEmotionCache();
interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const emptyConfigValue = {
  config: {
    projectId: '',
    catalogName: '',
    searchServiceName: ''
  },
  setConfig: () => {}
}

export const ConfigContext = React.createContext<{config: Config, setConfig: Dispatch<SetStateAction<Config>>}>(emptyConfigValue)

function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const [config, setConfig] = useState<Config>({})

  return (
    <ConfigContext.Provider value={emptyConfigValue}>
      <CacheProvider value={emotionCache}>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </CacheProvider>
    </ConfigContext.Provider>
  )
}

export default MyApp
