/**
 * Instagram Embed component for React Native
 * https://github.com/GaborWnuk
 * @flow
 */

import React, { PureComponent } from 'react';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 3,
  },
  headerContainer: { flexDirection: 'row', margin: 8, alignItems: 'center' },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#cccccc',
  },
  author: { marginLeft: 8, fontWeight: '500' },
  titleContainer: { flexDirection: 'row', margin: 8 },
  statsContainer: {
    flexDirection: 'row',
    marginVertical: 6,
    alignItems: 'center',
  },
  statIcon: { width: 16, height: 14 },
  statLabel: { fontWeight: '500', marginHorizontal: 8 },
});
