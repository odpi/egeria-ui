import { ActionIcon, Grid, LoadingOverlay, Paper, Table } from '@mantine/core';
import { useEffect, useState } from 'react';
import { glossaries } from '../api/glossaries';
import { ListDetails } from 'tabler-icons-react';

export function EgeriaGlossary() {
  const [glossariesData, setGlossariesData] = useState([]);
  const [glossaryCategoriesData, setGlossaryCategoriesData] = useState([]);
  const [glossaryTermsData, setGlossaryTermsData] = useState([]);

  useEffect(() => {
    glossaries.getAll().then(response => response.json()).then(data => {
      setGlossariesData(data.map((d: any) => {
        return {
          displayName: d.displayName,
          status: d.status
        }
      }));
    });

    glossaries.getGlossaryCategories().then(response => response.json()).then(data => {
      setGlossaryCategoriesData(data.map((d: any) => {
        return {
          displayName: d.displayName,
          status: d.status
        };
      }));
    });

    glossaries.getGlossaryTerms().then(response => response.json()).then(data => {
      setGlossaryTermsData(data.map((d: any) => {
        return {
          displayName: d.displayName,
          status: d.status
        };
      }));
    });
  }, []);

  const glossaryRows = glossariesData.map((element: any, index: number) => (
    <tr key={index}>
      <td>{element.displayName}</td>
      <td>{element.status}</td>
      <td>{ <ActionIcon><ListDetails /></ActionIcon> }</td>
    </tr>
  ));

  const glossaryCateogriesRows = glossaryCategoriesData.map((element: any, index: number) => (
    <tr key={index}>
      <td>{element.displayName}</td>
      <td>{element.status}</td>
      <td>{ <ActionIcon><ListDetails /></ActionIcon> }</td>
    </tr>
  ));

  const glossaryTermsRows = glossaryTermsData.map((element: any, index: number) => (
    <tr key={index}>
      <td></td>
      <td></td>
      <td></td>
    </tr>
  ));

  return (
    <Grid grow gutter="xs" style={{height:'100%'}}>
      <Grid.Col span={4}>
        <Paper shadow="xs" style={{height: '100%', position: 'relative'}}>
          <LoadingOverlay visible={!(glossariesData.length > 0)} />
          <Table striped highlightOnHover>
            <thead>
              <tr>
                <th>Glossary</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>{glossaryRows}</tbody>
          </Table>
        </Paper>
      </Grid.Col>
      <Grid.Col span={4}>
        <Paper shadow="xs" style={{height: '100%', position: 'relative'}}>
          <LoadingOverlay visible={!(glossaryCategoriesData.length > 0)} />
          <Table striped highlightOnHover>
            <thead>
              <tr>
                <th>Category</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>{glossaryCateogriesRows}</tbody>
          </Table>
        </Paper>
      </Grid.Col>
      <Grid.Col span={4}>
        <Paper shadow="xs" style={{height: '100%', position: 'relative'}}>
            <LoadingOverlay visible={!(glossaryTermsData.length > 0)} />
            <Table striped highlightOnHover>
              <thead>
                <tr>
                  <th>Glossary term</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>{glossaryTermsRows}</tbody>
            </Table>
          </Paper>
      </Grid.Col>
    </Grid>
  );
}