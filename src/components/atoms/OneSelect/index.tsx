import { FC, ReactElement, useContext, useEffect, useState } from 'react';
import Select, { SelectProps, SelectValue } from 'antd/es/select';
import AppContext from 'contexts/AppContext';
import defaultService from 'services/defaultService';
import { sls } from 'utils/StorageUtils';

const { Option } = Select;

interface OneSelectProps extends SelectProps<SelectValue> {
  apiURL: string;
  valueAttr: string;
  labelAttr: string;
  keyAttr?: string;
  dataItems?: any[];
  useCache?: boolean;
  noDefaultOption?: boolean;
}

const OneSelect: FC<OneSelectProps> = (props: OneSelectProps): ReactElement => {
  const { dataItems = [], apiURL, keyAttr, valueAttr, labelAttr, useCache, noDefaultOption, ...rest } = props;
  const { t } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);

  const setCache = (data: any[]) => {
    sls.setItem(apiURL, JSON.stringify(data));
  };

  const getCache = () => {
    const cacheData = sls.getItem(apiURL) || 'false';
    return JSON.parse(cacheData);
  };

  const getData = async () => {
    setLoading(true);
    const response = await defaultService.get(apiURL, []);
    await setData(response);
    if (useCache) {
      setCache(response);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!dataItems.length && !data.length) {
      const cacheData = getCache();
      if (!useCache || !cacheData) {
        getData();
      } else {
        setData(cacheData);
      }
    } else {
      setData(dataItems);
    }
  }, []);

  return (
    <Select loading={loading} {...rest}>
      {noDefaultOption ? null : <Option value="">{t('Select')}</Option>}
      {data.map((d: any) => (
        <Option key={d[keyAttr || valueAttr]} value={d[valueAttr]}>
          {d[labelAttr]}
        </Option>
      ))}
    </Select>
  );
};

export default OneSelect;
