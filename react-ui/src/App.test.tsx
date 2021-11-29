import React from 'react';
import App from './App';
import { shallow } from 'enzyme';

describe("<App/>", () => {
  test("it starts", () => {
    const wrapper = shallow(
      <App/>
    );

      expect(wrapper.find('div img').length).toBe(1);
  });
});
