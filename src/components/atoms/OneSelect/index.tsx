import { FC, ReactElement, useEffect, useState } from 'react';
import Select, { SelectProps, SelectValue } from 'antd/es/select';
import { useAppContext } from 'providers/AppProvider';
import defaultService from 'services/defaultService';
import { sls } from 'utils/StorageUtils';

const { Option } = Select;

interface OneSelectProps extends SelectProps<SelectValue> {
  apiURL?: string;
  valueAttr: string;
  labelAttr: string;
  headers?: any;
  keyAttr?: string;
  dataItems?: any[];
  useCache?: boolean;
  noDefaultOption?: boolean;
}

export const OneSelect: FC<OneSelectProps> = (props: OneSelectProps): ReactElement => {
  const { dataItems = [], apiURL, keyAttr, valueAttr, labelAttr, useCache, noDefaultOption, headers, ...rest } = props;
  const { t } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  let isMounted = true;

  const setCache = (data: any[]) => {
    sls.setItem(apiURL, data);
  };

  const getCache = () => {
    const cacheData = sls.getItem(apiURL) || false;
    return cacheData;
  };

  const getData = async () => {
    if (apiURL) {
      setLoading(true);
      const response = await defaultService.get(apiURL, [], { headers });
      if (isMounted) {
        setLoading(false);
        setData(response);
      }

      if (useCache) {
        setCache(response);
      }
    }
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

    return () => {
      isMounted = false;
    };
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
